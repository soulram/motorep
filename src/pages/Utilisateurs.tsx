import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const Utilisateurs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Change this line:
        const response = await fetch('http://localhost:5000/api/users'); // <--- Corrected URL
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement des utilisateurs: ${response.statusText}`);
        }
        const data = await response.json();
        // Map backend user data to frontend user data shape
        const mappedUsers = data.map((user: any) => {
          const [prenom, ...nomParts] = user.full_name ? user.full_name.split(' ') : ['', ''];
          const nom = nomParts.join(' ') || '';
          return {
            id: String(user.id),
            prenom: prenom || '',
            nom: nom || '',
            email: user.username || '',
            telephone: user.phone || '',
            role: user.role || 'receptionniste',
            dateCreation: user.created_at ? user.created_at.split('T')[0] : '',
            dernierConnexion: null,
            actif: true
          };
        });
        setUtilisateurs(mappedUsers);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Administrateur</Badge>;
      case 'mecanicien':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Mécanicien</Badge>;
      case 'receptionniste':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Réceptionniste</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'mecanicien':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'receptionniste':
        return <User className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredUtilisateurs = utilisateurs.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUtilisateurs(prev => prev.filter(u => u.id !== userId));
      toast.success('Utilisateur supprimé avec succès');
    }
  };

  const handleSaveUser = async (userData: any) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (editingUser) {
        // Update existing user
        response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prenom: userData.prenom,
            nom: userData.nom,
            username: userData.email,
            telephone: userData.telephone,
            role: userData.role,
            motDePasse: userData.motDePasse || undefined,
          }),
        });
      } else {
        // Create new user
        response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prenom: userData.prenom,
            nom: userData.nom,
            username: userData.email,
            telephone: userData.telephone,
            role: userData.role,
            motDePasse: userData.motDePasse,
          }),
        });
      }

      if (!response.ok) {
        let errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = null;
        }
        console.error('Backend error response:', errorText);
        throw new Error(errorData?.error || errorText || 'Erreur lors de la sauvegarde de l\'utilisateur');
      }

      let savedUser;
      try {
        savedUser = await response.json();
      } catch {
        savedUser = null;
      }
      if (!savedUser) {
        throw new Error('Réponse invalide du serveur');
      }

      // Map backend user data to frontend user data shape
      const [prenom, ...nomParts] = savedUser.full_name ? savedUser.full_name.split(' ') : ['', ''];
      const nom = nomParts.join(' ') || '';

      const mappedUser = {
        id: String(savedUser.id),
        prenom: prenom || '',
        nom: nom || '',
        email: savedUser.username || '',
        telephone: savedUser.phone || '',
        role: savedUser.role || 'receptionniste',
        dateCreation: savedUser.created_at ? savedUser.created_at.split('T')[0] : '',
        dernierConnexion: null,
        actif: true,
      };

      setUtilisateurs((prev) => {
        if (editingUser) {
          // Update user in list
          return prev.map((u) => (u.id === mappedUser.id ? mappedUser : u));
        } else {
          // Add new user to list
          return [...prev, mappedUser];
        }
      });

      setIsDialogOpen(false);
      toast.success(editingUser ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès');
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
      toast.error(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="w-8 h-8 mr-3" />
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600 mt-2">Administration des comptes utilisateurs</p>
      </div>

      {/* Filtres et actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="mecanicien">Mécanicien</SelectItem>
                  <SelectItem value="receptionniste">Réceptionniste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {utilisateurs.filter(u => u.role === 'admin').length}
                </p>
                <p className="text-sm text-gray-600">Administrateurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {utilisateurs.filter(u => u.role === 'mecanicien').length}
                </p>
                <p className="text-sm text-gray-600">Mécaniciens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {utilisateurs.filter(u => u.role === 'receptionniste').length}
                </p>
                <p className="text-sm text-gray-600">Réceptionnistes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{utilisateurs.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {filteredUtilisateurs.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <p>Chargement des utilisateurs...</p>
            ) : error ? (
              <p className="text-red-600">Erreur: {error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Création</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUtilisateurs.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <div className="ml-3">
                            <div className="font-medium">{user.prenom} {user.nom}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {user.telephone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {user.dateCreation}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.dernierConnexion ? (
                          <div className="flex items-center text-sm">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {user.dernierConnexion}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Jamais connecté</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.actif ? "default" : "secondary"}>
                          {user.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour créer/modifier un utilisateur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Modifiez les informations de l\'utilisateur' : 'Créez un nouveau compte utilisateur'}
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            user={editingUser} 
            onSave={handleSaveUser}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant formulaire utilisateur
const UserForm = ({ user, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    role: user?.role || 'receptionniste',
    motDePasse: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          value={formData.telephone}
          onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="role">Rôle *</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="mecanicien">Mécanicien</SelectItem>
            <SelectItem value="receptionniste">Réceptionniste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="motDePasse">
          {user ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
        </Label>
        <Input
          id="motDePasse"
          type="password"
          value={formData.motDePasse}
          onChange={(e) => setFormData(prev => ({ ...prev, motDePasse: e.target.value }))}
          required={!user}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {user ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default Utilisateurs;
