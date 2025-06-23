import { useState, useEffect } from 'react';
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
  numero_chassis: z.string().min(1, 'Le numéro de châssis est requis'),
  id_modele: z.number().min(1, 'Le modèle est requis'),
  nom_client: z.string().min(1, 'Le nom du client est requis'),
  telephone_client: z.string().min(1, 'Le téléphone client est requis'),
  type_entretien: z.string().min(1, 'Le type d\'entretien est requis'),
  kilometrage: z.number().min(0, 'Le kilométrage doit être positif'),
  id_mecanicien: z.number().min(1, 'Le mécanicien est requis'),
  commentaire: z.string().optional()
});

type ChecklistFormData = z.infer<typeof checklistSchema>;

const ChecklistEntree = () => {
  const [contratInfo, setContratInfo] = useState<any>(null);
  const [servicesRecommandes, setServicesRecommandes] = useState<any[]>([]);
  const [isSearchingContrat, setIsSearchingContrat] = useState(false);
  const [modeles, setModeles] = useState<any[]>([]);
  const [mecaniciens, setMecaniciens] = useState<any[]>([]);
  const [prestations, setPrestations] = useState<any[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema)
  });

  const numeroChassis = watch('numero_chassis');
  const kilometrage = watch('kilometrage');
  const idModele = watch('id_modele');

  // Charger les données de référence
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelesRes, mecaniciensRes, prestationsRes] = await Promise.all([
          fetch('http://localhost:5000/api/modeles'),
          fetch('http://localhost:5000/api/mecaniciens'),
          fetch('http://localhost:5000/api/prestations')
        ]);

        if (modelesRes.ok) {
          const modelesData = await modelesRes.json();
          setModeles(modelesData);
        }

        if (mecaniciensRes.ok) {
          const mecaniciensData = await mecaniciensRes.json();
          setMecaniciens(mecaniciensData);
        }

        if (prestationsRes.ok) {
          const prestationsData = await prestationsRes.json();
          setPrestations(prestationsData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, []);

  // Recherche de contrat par numéro de châssis
  useEffect(() => {
    const rechercherContrat = async () => {
      if (!numeroChassis || numeroChassis.length < 5) {
        setContratInfo(null);
        return;
      }
      
      setIsSearchingContrat(true);
      
      try {
        const response = await fetch(`http://localhost:5000/api/contrats/chassis/${numeroChassis}`);
        if (response.ok) {
          const contrat = await response.json();
          setContratInfo(contrat);
          setValue('nom_client', contrat.client_nom);
          setValue('telephone_client', contrat.client_telephone);
        } else {
          setContratInfo(null);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche du contrat:', error);
        setContratInfo(null);
      } finally {
        setIsSearchingContrat(false);
      }
    };

    const timeoutId = setTimeout(rechercherContrat, 500);
    return () => clearTimeout(timeoutId);
  }, [numeroChassis, setValue]);

  // Recommandations de services selon kilométrage
  useEffect(() => {
    const obtenirServicesRecommandes = () => {
      if (!kilometrage || !idModele) return;

      const services = [];
      
      if (kilometrage >= 5000) {
        services.push({ nom: 'Vidange moteur', obligatoire: true });
        services.push({ nom: 'Contrôle freins', obligatoire: true });
      }
      
      if (kilometrage >= 10000) {
        services.push({ nom: 'Révision complète', obligatoire: true });
        services.push({ nom: 'Contrôle suspension', obligatoire: false });
      }
      
      if (kilometrage >= 15000) {
        services.push({ nom: 'Remplacement bougies', obligatoire: true });
        services.push({ nom: 'Contrôle pneus', obligatoire: false });
      }

      setServicesRecommandes(services);
    };

    obtenirServicesRecommandes();
  }, [kilometrage, idModele]);

  const onSubmit = async (data: ChecklistFormData) => {
    try {
      // Créer l'intervention
      const interventionData = {
        numero_chassis: data.numero_chassis,
        modele_moto: modeles.find(m => m.id === data.id_modele)?.nom || '',
        nom_client: data.nom_client,
        telephone_client: data.telephone_client,
        type_entretien: data.type_entretien,
        kilometrage: data.kilometrage,
        id_mecanicien: data.id_mecanicien,
        commentaire: data.commentaire,
        prestations: servicesRecommandes.filter(s => s.obligatoire).map(s => ({
          id_prestation: prestations.find(p => p.nom === s.nom)?.id || 1,
          quantite: 1
        }))
      };

      const response = await fetch('http://localhost:5000/api/interventions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interventionData),
      });

      if (response.ok) {
        const intervention = await response.json();
        toast.success(`Intervention ${intervention.id} créée avec succès`);
        
        // Réinitialiser le formulaire
        window.location.reload();
      } else {
        throw new Error('Erreur lors de la création de l\'intervention');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création de l\'intervention');
    }
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
                  <Label htmlFor="id_modele">Modèle de la moto *</Label>
                  <Select onValueChange={(value) => setValue('id_modele', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {modeles.map((modele) => (
                        <SelectItem key={modele.id} value={modele.id.toString()}>
                          {modele.marque_nom} {modele.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id_modele && (
                    <p className="text-sm text-red-600 mt-1">{errors.id_modele.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="numero_chassis">Numéro de châssis *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="numero_chassis"
                      {...register('numero_chassis')}
                      placeholder="VIN123456789"
                      className="pl-10"
                    />
                    {isSearchingContrat && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {errors.numero_chassis && (
                    <p className="text-sm text-red-600 mt-1">{errors.numero_chassis.message}</p>
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

                <div>
                  <Label htmlFor="type_entretien">Type d'entretien *</Label>
                  <Select onValueChange={(value) => setValue('type_entretien', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Révision périodique">Révision périodique</SelectItem>
                      <SelectItem value="Réparation panne">Réparation panne</SelectItem>
                      <SelectItem value="Changement pneus">Changement pneus</SelectItem>
                      <SelectItem value="Entretien chaîne">Entretien chaîne</SelectItem>
                      <SelectItem value="Diagnostic électronique">Diagnostic électronique</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type_entretien && (
                    <p className="text-sm text-red-600 mt-1">{errors.type_entretien.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="id_mecanicien">Mécanicien assigné *</Label>
                <Select onValueChange={(value) => setValue('id_mecanicien', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mécanicien" />
                  </SelectTrigger>
                  <SelectContent>
                    {mecaniciens.map((mecanicien) => (
                      <SelectItem key={mecanicien.id} value={mecanicien.id.toString()}>
                        {mecanicien.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_mecanicien && (
                  <p className="text-sm text-red-600 mt-1">{errors.id_mecanicien.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="commentaire">Observations</Label>
                <Textarea
                  id="commentaire"
                  {...register('commentaire')}
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
                  <Label htmlFor="nom_client">Nom du client *</Label>
                  <Input
                    id="nom_client"
                    {...register('nom_client')}
                    placeholder="Nom Prénom"
                  />
                  {errors.nom_client && (
                    <p className="text-sm text-red-600 mt-1">{errors.nom_client.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telephone_client">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="telephone_client"
                      {...register('telephone_client')}
                      placeholder="0123456789"
                      className="pl-10"
                    />
                  </div>
                  {errors.telephone_client && (
                    <p className="text-sm text-red-600 mt-1">{errors.telephone_client.message}</p>
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
                    <span className="text-sm text-gray-600">Type:</span>
                    <Badge variant="outline">{contratInfo.type_contrat}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expiration:</span>
                    <span className="text-sm font-medium">{contratInfo.date_fin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kilométrage:</span>
                    <span className="text-sm font-medium">
                      {contratInfo.kilometrage_actuel?.toLocaleString()} km
                    </span>
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
            Créer l'Intervention
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChecklistEntree;