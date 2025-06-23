import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wrench, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Calendar,
  User,
  Bike,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Reparations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reparations, setReparations] = useState([]);

  useEffect(() => {
    const fetchReparations = async () => {
      try {
        const response = await fetch('/api/repairs');
        if (!response.ok) {
          throw new Error('Failed to fetch repairs');
        }
        const data = await response.json();
        // Map backend data to frontend structure
        const mappedData = data.map(item => ({
          id: item.repair_number,
          checklistId: item.checklist_id,
          modele: '', // Could fetch moto model separately if needed
          immatriculation: '',
          client: '',
          mecanicien: '', // Could fetch user name separately if needed
          dateDebut: item.date || '',
          dateFin: null,
          statut: 'en_cours', // Status not in backend, defaulting
          services: [],
          pieces: [],
          cout: 0,
          kilometrage: item.mileage || 0
        }));
        setReparations(mappedData);
      } catch (error) {
        console.error('Error fetching repairs:', error);
      }
    };
    fetchReparations();
  }, []);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'terminee':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Terminée</Badge>;
      case 'en_cours':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case 'en_attente':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">En attente</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'terminee':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'en_cours':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'en_attente':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredReparations = reparations.filter(rep => {
    const matchesSearch = rep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.modele.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rep.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Wrench className="w-8 h-8 mr-3" />
          Gestion des Réparations
        </h1>
        <p className="text-gray-600 mt-2">Suivi des interventions en atelier</p>
      </div>

      {/* Filtres et actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par numéro, client, modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Réparation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle réparation</DialogTitle>
                  <DialogDescription>
                    Sélectionnez une checklist validée pour créer une réparation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Fonctionnalité en cours de développement...
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reparations.filter(r => r.statut === 'en_attente').length}
                </p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reparations.filter(r => r.statut === 'en_cours').length}
                </p>
                <p className="text-sm text-gray-600">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reparations.filter(r => r.statut === 'terminee').length}
                </p>
                <p className="text-sm text-gray-600">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                <Wrench className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reparations.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des réparations */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Réparations</CardTitle>
          <CardDescription>
            {filteredReparations.length} réparation(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Mécanicien</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Coût</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReparations.map((reparation) => (
                  <TableRow key={reparation.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getStatusIcon(reparation.statut)}
                        <span className="ml-2">{reparation.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reparation.modele}</div>
                        <div className="text-sm text-gray-500">{reparation.immatriculation}</div>
                        <div className="text-xs text-gray-400">{reparation.kilometrage.toLocaleString()} km</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {reparation.client}
                      </div>
                    </TableCell>
                    <TableCell>{reparation.mecanicien}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {reparation.dateDebut}
                        </div>
                        {reparation.dateFin && (
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {reparation.dateFin}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(reparation.statut)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {reparation.cout.toFixed(2)}€
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reparations;