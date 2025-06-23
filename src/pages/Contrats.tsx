import { useState } from 'react';
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

  // Données simulées des contrats
  const contrats = [
    {
      id: 'CTR-2024-001',
      client: 'Dupont Jean',
      telephone: '0123456789',
      email: 'jean.dupont@email.com',
      dateDebut: '2024-01-15',
      dateFin: '2025-01-15',
      kilometrageMax: 15000,
      kilometrageUtilise: 8500,
      statut: 'actif',
      servicesInclus: ['Vidange', 'Révision', 'Contrôle technique'],
      piecesAllouees: {
        'Filtre à huile': { alloue: 4, utilise: 2, restant: 2 },
        'Huile moteur': { alloue: 20, utilise: 8, restant: 12 },
        'Plaquettes frein': { alloue: 2, utilise: 0, restant: 2 }
      },
      coutTotal: 450.00,
      coutUtilise: 185.50
    },
    {
      id: 'CTR-2024-002',
      client: 'Martin Sophie',
      telephone: '0987654321',
      email: 'sophie.martin@email.com',
      dateDebut: '2024-03-10',
      dateFin: '2025-03-10',
      kilometrageMax: 12000,
      kilometrageUtilise: 11800,
      statut: 'expire_bientot',
      servicesInclus: ['Vidange', 'Révision'],
      piecesAllouees: {
        'Filtre à huile': { alloue: 3, utilise: 3, restant: 0 },
        'Huile moteur': { alloue: 15, utilise: 14, restant: 1 }
      },
      coutTotal: 320.00,
      coutUtilise: 298.00
    },
    {
      id: 'CTR-2023-045',
      client: 'Leroy Pierre',
      telephone: '0147258369',
      email: 'pierre.leroy@email.com',
      dateDebut: '2023-06-01',
      dateFin: '2024-06-01',
      kilometrageMax: 18000,
      kilometrageUtilise: 18000,
      statut: 'expire',
      servicesInclus: ['Vidange', 'Révision', 'Contrôle technique', 'Pneus'],
      piecesAllouees: {
        'Filtre à huile': { alloue: 5, utilise: 5, restant: 0 },
        'Huile moteur': { alloue: 25, utilise: 25, restant: 0 },
        'Pneus': { alloue: 2, utilise: 2, restant: 0 }
      },
      coutTotal: 680.00,
      coutUtilise: 680.00
    }
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
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

  const getStatusIcon = (statut: string) => {
    switch (statut) {
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
    const matchesSearch = contrat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contrat.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contrat.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateKilometrageProgress = (utilise: number, max: number) => {
    return Math.min((utilise / max) * 100, 100);
  };

  const calculateCostProgress = (utilise: number, total: number) => {
    return Math.min((utilise / total) * 100, 100);
  };

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
                  placeholder="Rechercher par numéro ou client..."
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
                  {contrats.filter(c => c.statut === 'actif').length}
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
                  {contrats.filter(c => c.statut === 'expire_bientot').length}
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
                  {contrats.filter(c => c.statut === 'expire').length}
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
                <p className="text-2xl font-bold text-gray-900">
                  {contrats.reduce((sum, c) => sum + c.coutUtilise, 0).toFixed(0)}€
                </p>
                <p className="text-sm text-gray-600">CA généré</p>
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
                          {getStatusIcon(contrat.statut)}
                          <span className="ml-2 font-semibold text-lg">{contrat.id}</span>
                        </div>
                        {getStatusBadge(contrat.statut)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">{contrat.client}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {contrat.dateDebut} → {contrat.dateFin}
                          </span>
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
                          <span>Utilisé: {contrat.kilometrageUtilise.toLocaleString()} km</span>
                          <span>Max: {contrat.kilometrageMax.toLocaleString()} km</span>
                        </div>
                        <Progress 
                          value={calculateKilometrageProgress(contrat.kilometrageUtilise, contrat.kilometrageMax)} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500">
                          {(100 - calculateKilometrageProgress(contrat.kilometrageUtilise, contrat.kilometrageMax)).toFixed(1)}% restant
                        </div>
                      </div>

                      <h4 className="font-medium text-gray-900 mt-4">Utilisation Budget</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilisé: {contrat.coutUtilise.toFixed(2)}€</span>
                          <span>Total: {contrat.coutTotal.toFixed(2)}€</span>
                        </div>
                        <Progress 
                          value={calculateCostProgress(contrat.coutUtilise, contrat.coutTotal)} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500">
                          {(contrat.coutTotal - contrat.coutUtilise).toFixed(2)}€ restant
                        </div>
                      </div>
                    </div>

                    {/* Pièces allouées */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Pièces Allouées</h4>
                      <div className="space-y-2">
                        {Object.entries(contrat.piecesAllouees).map(([piece, data]) => (
                          <div key={piece} className="bg-gray-50 p-2 rounded">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{piece}</span>
                              <span className="text-gray-600">
                                {data.utilise}/{data.alloue}
                              </span>
                            </div>
                            <Progress 
                              value={(data.utilise / data.alloue) * 100} 
                              className="h-1 mt-1"
                            />
                            {data.restant === 0 && (
                              <div className="text-xs text-red-600 mt-1">
                                Stock épuisé
                              </div>
                            )}
                          </div>
                        ))}
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