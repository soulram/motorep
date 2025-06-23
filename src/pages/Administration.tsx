import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Bike,
  Wrench,
  Package,
  Target,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

const Administration = () => {
  // États pour les différentes données
  const [modeles, setModeles] = useState([
    { id: '1', nom: 'Yamaha MT-07', marque: 'Yamaha', cylindree: 689, type: 'Roadster' },
    { id: '2', nom: 'Honda CBR600RR', marque: 'Honda', cylindree: 599, type: 'Sportive' },
    { id: '3', nom: 'Kawasaki Z900', marque: 'Kawasaki', cylindree: 948, type: 'Roadster' }
  ]);

  const [services, setServices] = useState([
    { id: '1', nom: 'Vidange moteur', prix: 45.00, duree: 30, description: 'Changement huile moteur' },
    { id: '2', nom: 'Révision complète', prix: 120.00, duree: 120, description: 'Contrôle général du véhicule' },
    { id: '3', nom: 'Changement pneus', prix: 80.00, duree: 60, description: 'Montage/démontage pneus' }
  ]);

  const [pieces, setPieces] = useState([
    { id: '1', nom: 'Filtre à huile', prix: 15.00, stock: 25, reference: 'FO-001', fournisseur: 'Yamaha' },
    { id: '2', nom: 'Huile moteur 4L', prix: 35.00, stock: 12, reference: 'HM-4L', fournisseur: 'Castrol' },
    { id: '3', nom: 'Plaquettes frein AV', prix: 45.00, stock: 8, reference: 'PF-AV01', fournisseur: 'Brembo' }
  ]);

  const [seuils, setSeuils] = useState([
    { 
      id: '1', 
      modele: 'Yamaha MT-07', 
      kilometrage: 5000, 
      services: ['Vidange moteur'], 
      pieces: ['Filtre à huile', 'Huile moteur 4L'],
      description: 'Premier entretien'
    },
    { 
      id: '2', 
      modele: 'Yamaha MT-07', 
      kilometrage: 10000, 
      services: ['Révision complète'], 
      pieces: ['Filtre à huile', 'Huile moteur 4L', 'Plaquettes frein AV'],
      description: 'Révision majeure'
    }
  ]);

  const [mecaniciens, setMecaniciens] = useState([
    { id: '1', nom: 'Jean Dupont', specialite: 'Mécanique générale', telephone: '0123456789', actif: true },
    { id: '2', nom: 'Marie Martin', specialite: 'Électronique', telephone: '0123456790', actif: true },
    { id: '3', nom: 'Pierre Durand', specialite: 'Carrosserie', telephone: '0123456791', actif: true }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Settings className="w-8 h-8 mr-3" />
          Administration
        </h1>
        <p className="text-gray-600 mt-2">Configuration et paramétrage du système</p>
      </div>

      <Tabs defaultValue="modeles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="modeles" className="flex items-center">
            <Bike className="w-4 h-4 mr-2" />
            Modèles
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center">
            <Wrench className="w-4 h-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="pieces" className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Pièces
          </TabsTrigger>
          <TabsTrigger value="seuils" className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Seuils
          </TabsTrigger>
          <TabsTrigger value="mecaniciens" className="flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Mécaniciens
          </TabsTrigger>
        </TabsList>

        {/* Gestion des modèles */}
        <TabsContent value="modeles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Modèles de Motos</CardTitle>
                  <CardDescription>Gestion des modèles de véhicules</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau Modèle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouveau Modèle</DialogTitle>
                      <DialogDescription>Ajouter un nouveau modèle de moto</DialogDescription>
                    </DialogHeader>
                    <ModeleForm onSave={(data) => {
                      setModeles(prev => [...prev, { ...data, id: String(Date.now()) }]);
                      toast.success('Modèle ajouté avec succès');
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Marque</TableHead>
                    <TableHead>Cylindrée</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modeles.map((modele) => (
                    <TableRow key={modele.id}>
                      <TableCell className="font-medium">{modele.nom}</TableCell>
                      <TableCell>{modele.marque}</TableCell>
                      <TableCell>{modele.cylindree} cc</TableCell>
                      <TableCell>
                        <Badge variant="outline">{modele.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des services */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Gestion des prestations proposées</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouveau Service</DialogTitle>
                      <DialogDescription>Ajouter une nouvelle prestation</DialogDescription>
                    </DialogHeader>
                    <ServiceForm onSave={(data) => {
                      setServices(prev => [...prev, { ...data, id: String(Date.now()) }]);
                      toast.success('Service ajouté avec succès');
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.nom}</TableCell>
                      <TableCell>{service.prix.toFixed(2)}€</TableCell>
                      <TableCell>{service.duree} min</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des pièces */}
        <TabsContent value="pieces">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pièces Détachées</CardTitle>
                  <CardDescription>Gestion du stock de pièces</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle Pièce
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle Pièce</DialogTitle>
                      <DialogDescription>Ajouter une nouvelle pièce détachée</DialogDescription>
                    </DialogHeader>
                    <PieceForm onSave={(data) => {
                      setPieces(prev => [...prev, { ...data, id: String(Date.now()) }]);
                      toast.success('Pièce ajoutée avec succès');
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pieces.map((piece) => (
                    <TableRow key={piece.id}>
                      <TableCell className="font-medium">{piece.nom}</TableCell>
                      <TableCell>{piece.reference}</TableCell>
                      <TableCell>{piece.prix.toFixed(2)}€</TableCell>
                      <TableCell>
                        <Badge variant={piece.stock < 10 ? "destructive" : "default"}>
                          {piece.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>{piece.fournisseur}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des seuils */}
        <TabsContent value="seuils">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Seuils d'Entretien</CardTitle>
                  <CardDescription>Configuration des intervalles de maintenance</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau Seuil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Nouveau Seuil</DialogTitle>
                      <DialogDescription>Configurer un nouveau seuil d'entretien</DialogDescription>
                    </DialogHeader>
                    <SeuilForm 
                      modeles={modeles}
                      services={services}
                      pieces={pieces}
                      onSave={(data) => {
                        setSeuils(prev => [...prev, { ...data, id: String(Date.now()) }]);
                        toast.success('Seuil ajouté avec succès');
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seuils.map((seuil) => (
                  <Card key={seuil.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-lg">{seuil.modele}</h4>
                          <p className="text-sm text-gray-600">{seuil.description}</p>
                          <Badge className="mt-2">{seuil.kilometrage.toLocaleString()} km</Badge>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Services inclus:</h5>
                          <div className="space-y-1">
                            {seuil.services.map((service, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Pièces nécessaires:</h5>
                          <div className="space-y-1">
                            {seuil.pieces.map((piece, idx) => (
                              <Badge key={idx} variant="secondary" className="mr-1">
                                {piece}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des mécaniciens */}
        <TabsContent value="mecaniciens">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Mécaniciens</CardTitle>
                  <CardDescription>Gestion de l'équipe technique</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau Mécanicien
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouveau Mécanicien</DialogTitle>
                      <DialogDescription>Ajouter un nouveau membre à l'équipe</DialogDescription>
                    </DialogHeader>
                    <MecanicienForm onSave={(data) => {
                      setMecaniciens(prev => [...prev, { ...data, id: String(Date.now()) }]);
                      toast.success('Mécanicien ajouté avec succès');
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mecaniciens.map((mecanicien) => (
                    <TableRow key={mecanicien.id}>
                      <TableCell className="font-medium">{mecanicien.nom}</TableCell>
                      <TableCell>{mecanicien.specialite}</TableCell>
                      <TableCell>{mecanicien.telephone}</TableCell>
                      <TableCell>
                        <Badge variant={mecanicien.actif ? "default" : "secondary"}>
                          {mecanicien.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Formulaires pour chaque type de données
const ModeleForm = ({ onSave }: any) => {
  const [formData, setFormData] = useState({
    nom: '', marque: '', cylindree: 0, type: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom du modèle *</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="marque">Marque *</Label>
        <Input
          id="marque"
          value={formData.marque}
          onChange={(e) => setFormData(prev => ({ ...prev, marque: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="cylindree">Cylindrée (cc) *</Label>
        <Input
          id="cylindree"
          type="number"
          value={formData.cylindree}
          onChange={(e) => setFormData(prev => ({ ...prev, cylindree: parseInt(e.target.value) }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Type *</Label>
        <Input
          id="type"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          placeholder="Roadster, Sportive, Trail..."
          required
        />
      </div>
      <Button type="submit" className="w-full">Ajouter</Button>
    </form>
  );
};

const ServiceForm = ({ onSave }: any) => {
  const [formData, setFormData] = useState({
    nom: '', prix: 0, duree: 0, description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom du service *</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prix">Prix (€) *</Label>
          <Input
            id="prix"
            type="number"
            step="0.01"
            value={formData.prix}
            onChange={(e) => setFormData(prev => ({ ...prev, prix: parseFloat(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="duree">Durée (min) *</Label>
          <Input
            id="duree"
            type="number"
            value={formData.duree}
            onChange={(e) => setFormData(prev => ({ ...prev, duree: parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <Button type="submit" className="w-full">Ajouter</Button>
    </form>
  );
};

const PieceForm = ({ onSave }: any) => {
  const [formData, setFormData] = useState({
    nom: '', prix: 0, stock: 0, reference: '', fournisseur: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom de la pièce *</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="reference">Référence *</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prix">Prix (€) *</Label>
          <Input
            id="prix"
            type="number"
            step="0.01"
            value={formData.prix}
            onChange={(e) => setFormData(prev => ({ ...prev, prix: parseFloat(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock initial *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="fournisseur">Fournisseur</Label>
        <Input
          id="fournisseur"
          value={formData.fournisseur}
          onChange={(e) => setFormData(prev => ({ ...prev, fournisseur: e.target.value }))}
        />
      </div>
      <Button type="submit" className="w-full">Ajouter</Button>
    </form>
  );
};

const SeuilForm = ({ modeles, services, pieces, onSave }: any) => {
  const [formData, setFormData] = useState({
    modele: '', kilometrage: 0, services: [], pieces: [], description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="modele">Modèle *</Label>
          <select
            id="modele"
            className="w-full p-2 border rounded"
            value={formData.modele}
            onChange={(e) => setFormData(prev => ({ ...prev, modele: e.target.value }))}
            required
          >
            <option value="">Sélectionner un modèle</option>
            {modeles.map((modele: any) => (
              <option key={modele.id} value={modele.nom}>{modele.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="kilometrage">Kilométrage *</Label>
          <Input
            id="kilometrage"
            type="number"
            value={formData.kilometrage}
            onChange={(e) => setFormData(prev => ({ ...prev, kilometrage: parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Ex: Premier entretien, Révision majeure..."
        />
      </div>
      <Button type="submit" className="w-full">Ajouter</Button>
    </form>
  );
};

const MecanicienForm = ({ onSave }: any) => {
  const [formData, setFormData] = useState({
    nom: '', specialite: '', telephone: '', actif: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom complet *</Label>
        <Input
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="specialite">Spécialité *</Label>
        <Input
          id="specialite"
          value={formData.specialite}
          onChange={(e) => setFormData(prev => ({ ...prev, specialite: e.target.value }))}
          placeholder="Mécanique générale, Électronique..."
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
      <Button type="submit" className="w-full">Ajouter</Button>
    </form>
  );
};

export default Administration;