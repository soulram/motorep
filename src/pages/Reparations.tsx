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
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/interventions');
        if (response.ok) {
          const data = await response.json();
          setInterventions(data);
        }
      } catch (error) {
        console.error('Error fetching interventions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, []);

  const getStatusBadge = (dateIntervention: string) => {
    const today = new Date();
    const interventionDate = new Date(dateIntervention);
    const diffDays = Math.ceil((today.getTime() - interventionDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) {
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Aujourd'hui</Badge>;
    } else if (diffDays < 0) {
      return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Programmée</Badge>;
    } else if (diffDays <= 7) {
      return <Badge className="bg-green-50 text-green-700 border-green-200">Récente</Badge>;
    } else {
      return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Ancienne</Badge>;
    }
  };

  const getStatusIcon = (dateIntervention: string) => {
    const today = new Date();
    const interventionDate = new Date(dateIntervention);
    const diffDays = Math.ceil((today.getTime() - interventionDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) {
      return <Clock className="w-4 h-4 text-blue-600" />;
    } else if (diffDays < 0) {
      return <AlertCircle className="w-4 h-4 text-orange-600" />;
    } else {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = intervention.numero_chassis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.modele_moto.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Wrench className="w-8 h-8 mr-3" />
            Gestion des Réparations
          </h1>
          <p className="text-gray-600 mt-2">Chargement des interventions...</p>
        </div>
      </div>
    );
  }

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
                  placeholder="Rechercher par châssis, client, modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {interventions.filter(i => {
                    const today = new Date();
                    const interventionDate = new Date(i.date_intervention);
                    return interventionDate.toDateString() === today.toDateString();
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {interventions.filter(i => new Date(i.date_intervention) > new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Programmées</p>
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
                  {interventions.filter(i => {
                    const today = new Date();
                    const interventionDate = new Date(i.date_intervention);
                    const diffDays = Math.ceil((today.getTime() - interventionDate.getTime()) / (1000 * 3600 * 24));
                    return diffDays > 0 && diffDays <= 7;
                  }).length}
                </p>
                <p className="text-sm text-gray-600">Cette semaine</p>
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
                <p className="text-2xl font-bold text-gray-900">{interventions.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Interventions</CardTitle>
          <CardDescription>
            {filteredInterventions.length} intervention(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intervention</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Mécanicien</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterventions.map((intervention) => (
                  <TableRow key={intervention.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getStatusIcon(intervention.date_intervention)}
                        <span className="ml-2">#{intervention.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{intervention.modele_moto}</div>
                        <div className="text-sm text-gray-500">{intervention.numero_chassis}</div>
                        <div className="text-xs text-gray-400">{intervention.kilometrage?.toLocaleString()} km</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {intervention.nom_client}
                        </div>
                        <div className="text-sm text-gray-500">{intervention.telephone_client}</div>
                      </div>
                    </TableCell>
                    <TableCell>{intervention.mecanicien_nom}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {formatDate(intervention.date_intervention)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{intervention.type_entretien}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(intervention.date_intervention)}
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