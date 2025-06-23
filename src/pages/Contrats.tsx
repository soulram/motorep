import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const Contrats = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContrats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contrats');
        if (response.ok) {
          const data = await response.json();
          setContrats(data);
        }
      } catch (error) {
        console.error('Error fetching contrats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContrats();
  }, []);

  const getContractStatus = (contrat) => {
    const today = new Date();
    const dateFin = new Date(contrat.date_fin);
    const diffDays = Math.ceil((dateFin.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (!contrat.actif) return 'expire';
    if (diffDays < 0) return 'expire';
    if (diffDays <= 30) return 'expire_bientot';
    return 'actif';
  };

  const getStatusBadge = (contrat) => {
    const status = getContractStatus(contrat);
    switch (status) {
      case 'actif':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Actif</Badge>;
      case 'expire_bientot':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Expire bientôt</Badge>;
      case 'expire':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Expiré</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (contrat) => {
    const status = getContractStatus(contrat);
    switch (status) {
      case 'actif':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'expire_bientot':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'expire':
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredContrats = contrats.filter(contrat => {
    const matchesSearch = contrat.id.toString().includes(searchTerm.toLowerCase()) ||
                         contrat.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contrat.numero_chassis.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getContractStatus(contrat);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateProgress = (current, max) => {
    if (!max) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            Gestion des Contrats
          </h1>
          <p className="text-gray-600 mt-2">Chargement des contrats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FileText className="w-8 h-8 mr-3" />
          Gestion des Contrats
        </h1>
        <p className="text-gray-600 mt-2">Suivi des contrats d'entretien clients</p>
      </div>

      {/* Filtres et actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par numéro, client, châssis..."
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
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="expire_bientot">Expire bientôt</SelectItem>
                  <SelectItem value="expire">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Contrat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {contrats.filter(c => getContractStatus(c) === 'actif').length}
                </p>
                <p className="text-sm text-gray-600">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {contrats.filter(c => getContractStatus(c) === 'expire_bientot').length}
                </p>
                <p className="text-sm text-gray-600">Expirent bientôt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {contrats.filter(c => getContractStatus(c) === 'expire').length}
                </p>
                <p className="text-sm text-gray-600">Expirés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{contrats.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des contrats */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Contrats</CardTitle>
          <CardDescription>
            {filteredContrats.length} contrat(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContrats.map((contrat) => (
              <Card key={contrat.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informations générales */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(contrat)}
                          <span className="ml-2 font-semibold text-lg">Contrat #{contrat.id}</span>
                        </div>
                        {getStatusBadge(contrat)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">{contrat.client_nom}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(contrat.date_debut)} → {formatDate(contrat.date_fin)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Véhicule:</strong> {contrat.marque_nom} {contrat.modele_nom}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Châssis:</strong> {contrat.numero_chassis}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>

                    {/* Utilisation kilométrage */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Utilisation Kilométrage</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Départ: {contrat.kilometrage_depart?.toLocaleString()} km</span>
                          <span>Actuel: {contrat.kilometrage_actuel?.toLocaleString()} km</span>
                        </div>
                        <Progress 
                          value={calculateProgress(
                            contrat.kilometrage_actuel - contrat.kilometrage_depart,
                            20000 // Limite fictive pour la démo
                          )} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500">
                          {(contrat.kilometrage_actuel - contrat.kilometrage_depart).toLocaleString()} km parcourus
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Type de contrat</h5>
                        <Badge variant="outline">{contrat.type_contrat}</Badge>
                        {contrat.type_description && (
                          <p className="text-xs text-gray-500">{contrat.type_description}</p>
                        )}
                      </div>
                    </div>

                    {/* Informations complémentaires */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Contact</h4>
                      <div className="space-y-1">
                        <div className="text-sm">{contrat.client_telephone}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Statut</h5>
                        <div className="text-sm">
                          {contrat.actif ? (
                            <span className="text-green-600">Contrat actif</span>
                          ) : (
                            <span className="text-red-600">Contrat inactif</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contrats;