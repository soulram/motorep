import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  Wrench, 
  FileText, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Checklists en attente',
      value: '12',
      description: 'Nouvelles entrées',
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Réparations en cours',
      value: '8',
      description: 'En atelier',
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Contrats actifs',
      value: '45',
      description: 'Clients sous contrat',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Mécaniciens',
      value: '6',
      description: 'Équipe active',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'checklist',
      title: 'Nouvelle checklist #CL-2025-001',
      description: 'Yamaha MT-07 - Révision 10 000 km',
      time: 'Il y a 15 min',
      status: 'pending'
    },
    {
      id: 2,
      type: 'reparation',
      title: 'Réparation terminée #REP-2025-045',
      description: 'Honda CBR600RR - Changement pneus',
      time: 'Il y a 1h',
      status: 'completed'
    },
    {
      id: 3,
      type: 'contrat',
      title: 'Contrat expirant',
      description: 'Client Dupont - Expire dans 7 jours',
      time: 'Il y a 2h',
      status: 'warning'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-50 text-green-700">Terminé</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700">Attention</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de l'activité de l'atelier</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Activités récentes
            </CardTitle>
            <CardDescription>
              Dernières actions dans l'atelier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Indicateurs de performance */}
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
            <CardDescription>
              Suivi des objectifs mensuels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Réparations terminées</span>
                <span className="text-sm text-gray-500">75/100</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Satisfaction client</span>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Délais respectés</span>
                <span className="text-sm text-gray-500">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Utilisation contrats</span>
                <span className="text-sm text-gray-500">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;