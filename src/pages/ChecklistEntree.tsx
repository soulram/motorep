import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ClipboardList, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Bike,
  User,
  Phone,
  Hash,
  Gauge
} from 'lucide-react';

const checklistSchema = z.object({
  modele: z.string().min(1, 'Le modèle est requis'),
  numeroChassis: z.string().min(1, 'Le numéro de châssis est requis'),
  immatriculation: z.string().min(1, 'L\'immatriculation est requise'),
  telephoneClient: z.string().min(1, 'Le téléphone client est requis'),
  nomClient: z.string().min(1, 'Le nom du client est requis'),
  natureReparation: z.string().min(1, 'La nature de la réparation est requise'),
  kilometrage: z.number().min(0, 'Le kilométrage doit être positif'),
  mecanicien: z.string().min(1, 'Le mécanicien est requis'),
  observations: z.string().optional()
});

type ChecklistFormData = z.infer<typeof checklistSchema>;

const ChecklistEntree = () => {
  const [contratInfo, setContratInfo] = useState<any>(null);
  const [servicesRecommandes, setServicesRecommandes] = useState<any[]>([]);
  const [isSearchingContrat, setIsSearchingContrat] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema)
  });

  const numeroChassis = watch('numeroChassis');
  const kilometrage = watch('kilometrage');
  const modele = watch('modele');

  const modelesMoto = [
    'Yamaha MT-07',
    'Yamaha MT-09',
    'Honda CBR600RR',
    'Honda CB650R',
    'Kawasaki Z900',
    'Suzuki GSX-R750',
    'BMW S1000RR',
    'Ducati Panigale V2'
  ];

  const mecaniciens = [
    'Jean Dupont',
    'Marie Martin',
    'Pierre Durand',
    'Sophie Leroy'
  ];

  const naturesReparation = [
    'Révision périodique',
    'Réparation panne',
    'Changement pneus',
    'Entretien chaîne',
    'Réglage carburateur',
    'Diagnostic électronique',
    'Autre'
  ];

  // Simulation de recherche de contrat
  const rechercherContrat = async (chassis: string) => {
    if (!chassis || chassis.length < 5) return;
    
    setIsSearchingContrat(true);
    
    // Simulation d'un appel API
    setTimeout(() => {
      if (chassis === 'VIN123456789') {
        setContratInfo({
          numeroContrat: 'CTR-2024-001',
          client: 'Dupont Jean',
          telephone: '0123456789',
          dateExpiration: '2025-12-31',
          kilometrageMax: 15000,
          kilometrageUtilise: 8500,
          valide: true
        });
        setValue('nomClient', 'Dupont Jean');
        setValue('telephoneClient', '0123456789');
      } else {
        setContratInfo(null);
      }
      setIsSearchingContrat(false);
    }, 1000);
  };

  // Simulation de recommandations de services selon kilométrage
  const obtenirServicesRecommandes = (km: number, modeleVehicule: string) => {
    if (!km || !modeleVehicule) return;

    const services = [];
    
    if (km >= 5000) {
      services.push({ nom: 'Vidange moteur', prix: 45, obligatoire: true });
      services.push({ nom: 'Changement filtre à huile', prix: 15, obligatoire: true });
    }
    
    if (km >= 10000) {
      services.push({ nom: 'Révision complète', prix: 120, obligatoire: true });
      services.push({ nom: 'Contrôle freins', prix: 30, obligatoire: true });
      services.push({ nom: 'Réglage chaîne', prix: 25, obligatoire: false });
    }
    
    if (km >= 15000) {
      services.push({ nom: 'Changement bougies', prix: 35, obligatoire: true });
      services.push({ nom: 'Contrôle suspension', prix: 40, obligatoire: false });
    }

    setServicesRecommandes(services);
  };

  // Effet pour rechercher le contrat quand le châssis change
  useState(() => {
    if (numeroChassis) {
      rechercherContrat(numeroChassis);
    }
  });

  // Effet pour obtenir les services recommandés
  useState(() => {
    if (kilometrage && modele) {
      obtenirServicesRecommandes(kilometrage, modele);
    }
  });

  const onSubmit = (data: ChecklistFormData) => {
    // Génération automatique du numéro de checklist
    const numeroChecklist = `CL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const checklistData = {
      ...data,
      numeroChecklist,
      dateCreation: new Date().toISOString(),
      statut: 'en_attente',
      contrat: contratInfo,
      servicesRecommandes
    };

    console.log('Données checklist:', checklistData);
    toast.success(`Checklist ${numeroChecklist} créée avec succès`);
    
    // Ici, vous feriez un appel API pour sauvegarder
    // await api.post('/checklists', checklistData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ClipboardList className="w-8 h-8 mr-3" />
          Checklist d'Entrée Moto
        </h1>
        <p className="text-gray-600 mt-2">Saisie des informations d'entrée en atelier</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations véhicule */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bike className="w-5 h-5 mr-2" />
                Informations Véhicule
              </CardTitle>
              <CardDescription>
                Détails techniques de la moto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modele">Modèle de la moto *</Label>
                  <Select onValueChange={(value) => setValue('modele', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelesMoto.map((modele) => (
                        <SelectItem key={modele} value={modele}>
                          {modele}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.modele && (
                    <p className="text-sm text-red-600 mt-1">{errors.modele.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="numeroChassis">Numéro de châssis *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="numeroChassis"
                      {...register('numeroChassis')}
                      placeholder="VIN123456789"
                      className="pl-10"
                    />
                    {isSearchingContrat && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {errors.numeroChassis && (
                    <p className="text-sm text-red-600 mt-1">{errors.numeroChassis.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="immatriculation">Immatriculation *</Label>
                  <Input
                    id="immatriculation"
                    {...register('immatriculation')}
                    placeholder="AB-123-CD"
                  />
                  {errors.immatriculation && (
                    <p className="text-sm text-red-600 mt-1">{errors.immatriculation.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="kilometrage">Kilométrage *</Label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="kilometrage"
                      type="number"
                      {...register('kilometrage', { valueAsNumber: true })}
                      placeholder="15000"
                      className="pl-10"
                    />
                  </div>
                  {errors.kilometrage && (
                    <p className="text-sm text-red-600 mt-1">{errors.kilometrage.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="natureReparation">Nature de la réparation *</Label>
                <Select onValueChange={(value) => setValue('natureReparation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de réparation" />
                  </SelectTrigger>
                  <SelectContent>
                    {naturesReparation.map((nature) => (
                      <SelectItem key={nature} value={nature}>
                        {nature}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.natureReparation && (
                  <p className="text-sm text-red-600 mt-1">{errors.natureReparation.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mecanicien">Mécanicien assigné *</Label>
                <Select onValueChange={(value) => setValue('mecanicien', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mécanicien" />
                  </SelectTrigger>
                  <SelectContent>
                    {mecaniciens.map((mecanicien) => (
                      <SelectItem key={mecanicien} value={mecanicien}>
                        {mecanicien}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.mecanicien && (
                  <p className="text-sm text-red-600 mt-1">{errors.mecanicien.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  {...register('observations')}
                  placeholder="Remarques particulières, défauts constatés..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations client et contrat */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nomClient">Nom du client *</Label>
                  <Input
                    id="nomClient"
                    {...register('nomClient')}
                    placeholder="Nom Prénom"
                  />
                  {errors.nomClient && (
                    <p className="text-sm text-red-600 mt-1">{errors.nomClient.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telephoneClient">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="telephoneClient"
                      {...register('telephoneClient')}
                      placeholder="0123456789"
                      className="pl-10"
                    />
                  </div>
                  {errors.telephoneClient && (
                    <p className="text-sm text-red-600 mt-1">{errors.telephoneClient.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations contrat */}
            {contratInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Contrat Trouvé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Numéro:</span>
                    <Badge variant="outline">{contratInfo.numeroContrat}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expiration:</span>
                    <span className="text-sm font-medium">{contratInfo.dateExpiration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kilométrage:</span>
                    <span className="text-sm font-medium">
                      {contratInfo.kilometrageUtilise} / {contratInfo.kilometrageMax} km
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(contratInfo.kilometrageUtilise / contratInfo.kilometrageMax) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Services recommandés */}
        {servicesRecommandes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Services Recommandés</CardTitle>
              <CardDescription>
                Basés sur le kilométrage et le modèle du véhicule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicesRecommandes.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{service.nom}</span>
                        {service.obligatoire && (
                          <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{service.prix}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Créer la Checklist
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChecklistEntree;