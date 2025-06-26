import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";


interface TypeContract {
  id: number;
  name: string;
}

interface Modele {
  id: number;
  name: string;
}

interface Piece {
  id: number;
  name: string;
}

interface Prestation {
  id: number;
  name: string;
}

const TypeContrats = () => {
  const [typeContrats, setTypeContrats] = useState<TypeContract[]>([]);
  const [editingTypeContratId, setEditingTypeContratId] = useState<number | null>(null);
  const [editingTypeContratName, setEditingTypeContratName] = useState('');
  const [newTypeContratName, setNewTypeContratName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [expandedTypeContratId, setExpandedTypeContratId] = useState<number | null>(null);
  const [contratPrestations, setContratPrestations] = useState<{ id: number; modelId: number; kilometrageCible: string; description: string; pieceId: number; prestationId: number }[]>([]);
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [prestations, setPrestations] = useState<Prestation[]>([]);

  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [kilometrageCible, setKilometrageCible] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [selectedPrestationId, setSelectedPrestationId] = useState<number | null>(null);

  useEffect(() => {
    fetchTypeContrats();
    fetchModeles();
    fetchPieces();
    fetchPrestations();
  }, []);

  // Fetch type contrats from the backend
  const fetchTypeContrats = async () => {
    try {
      const response = await fetch('/api/type-contracts');
      if (response.ok) {
        const json: TypeContract[] = await response.json();
        setTypeContrats(json);
      }
    } catch (error) {
      console.error('Error fetching type contracts:', error);
    }
  };

  // Fetch models from the backend
  const fetchModeles = async () => {
    try {
      const response = await fetch('/api/models');
      if (response.ok) {
        const json: Modele[] = await response.json();
        setModeles(json);
      }
    } catch (error) {
      console.error('Error fetching modeles:', error);
    }
  };

  // Fetch pieces from the backend
  const fetchPieces = async () => {
    try {
      const response = await fetch('/api/pieces');
      if (response.ok) {
        const json: Piece[] = await response.json();
        setPieces(json);
      }
    } catch (error) {
      console.error('Error fetching pieces:', error);
    }
  };

  // Fetch prestations from the backend
  const fetchPrestations = async () => {
    try {
      const response = await fetch('/api/prestations');
      if (response.ok) {
        const json: Prestation[] = await response.json();
        setPrestations(json);
      }
    } catch (error) {
      console.error('Error fetching prestations:', error);
    }
  };

  // Add new type of contract
  const handleCreateTypeContrat = async () => {
    try {
      const data = { name: newTypeContratName };
      const response = await fetch('/api/type-contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const json: TypeContract = await response.json();
        setTypeContrats([...typeContrats, json]);
        setNewTypeContratName('');
      } else {
        console.error('Failed to create type contract');
      }
    } catch (error) {
      console.error('Error creating type contract:', error);
    }
  };

  // Add new prestation for the selected type of contract
  const handleSaveContratPrestation = async () => {
    try {
      const data: { [key: string]: any } = {
        modelId: selectedModelId,
        kilometrageCible: kilometrageCible,
        description: description,
        pieceId: selectedPieceId,
        prestationId: selectedPrestationId,
      };
      
      const response = await fetch('/api/contrat-prestations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const json = await response.json();
        setContratPrestations([...contratPrestations, json]);
        setSelectedModelId(null);
        setKilometrageCible('');
        setDescription('');
        setSelectedPieceId(null);
        setSelectedPrestationId(null);
      } else {
        console.error('Failed to create prestation');
      }
    } catch (error) {
      console.error('Error creating prestation:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Input to create a new type contract */}
      <div className="flex gap-2">
        <Input
          value={newTypeContratName}
          onChange={(e) => setNewTypeContratName(e.target.value)}
          placeholder="Type de contrat"
        />
        <Button onClick={handleCreateTypeContrat}>Créer</Button>
      </div>
  
      {/* List of Type Contracts */}
      {typeContrats.map((contract) => (
        <Card key={contract.id}>
          <CardHeader>
            <CardTitle>{contract.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prestation Form */}
            <Input
              placeholder="Kilométrage cible"
              value={kilometrageCible}
              onChange={(e) => setKilometrageCible(e.target.value)}
            />
            <Select onValueChange={(value) => setSelectedModelId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                {modeles.map((model) => (
                  <SelectItem key={model.id} value={String(model.id)}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
  
            <Select onValueChange={(value) => setSelectedPrestationId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une prestation" />
              </SelectTrigger>
              <SelectContent>
                {prestations.map((prestation) => (
                  <SelectItem key={prestation.id} value={String(prestation.id)}>
                    {prestation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
  
            <Select onValueChange={(value) => setSelectedPieceId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une pièce" />
              </SelectTrigger>
              <SelectContent>
                {pieces.map((piece) => (
                  <SelectItem key={piece.id} value={String(piece.id)}>
                    {piece.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
  
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
  
            <Button onClick={() => setIsDialogOpen(true)}>Ajouter Prestation</Button>
  
            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Prestations pour {contract.name}</DialogTitle>
                </DialogHeader>
  
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modèle</TableHead>
                      <TableHead>Kilométrage</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratPrestations.map((prestation) => (
                      <TableRow key={prestation.id}>
                        <TableCell>
                          {modeles.find((m) => m.id === prestation.modelId)?.name}
                        </TableCell>
                        <TableCell>{prestation.kilometrageCible}</TableCell>
                        <TableCell>{prestation.description}</TableCell>
                        <TableCell>
                          {/* Optional: Add delete/edit buttons */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
  
                <DialogFooter>
                  <Button onClick={handleSaveContratPrestation}>Valider</Button>
                  <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
 export default TypeContrats;