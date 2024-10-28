import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bird, Cat, Dog, Rabbit } from 'lucide-react';

const pets = [
  { id: 'chicken', name: 'Chicken', icon: Bird, stages: ['🥚', '🐣', '🐥', '🐔'] },
  { id: 'cat', name: 'Cat', icon: Cat, stages: ['🥚', '😺', '😸', '😻'] },
  { id: 'dog', name: 'Dog', icon: Dog, stages: ['🥚', '🐶', '🐕', '🦮'] },
  { id: 'rabbit', name: 'Rabbit', icon: Rabbit, stages: ['🥚', '🐰', '🐇', '🦘'] },
];

interface StartMenuProps {
  onSelectPet: (pet: typeof pets[0]) => void;
}

export default function StartMenu({ onSelectPet }: StartMenuProps) {
  return (
    <div className="w-full max-w-md">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Choose Your Pet</h1>
        <div className="grid grid-cols-2 gap-4">
          {pets.map((pet) => (
            <Button
              key={pet.id}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30"
              onClick={() => onSelectPet(pet)}
            >
              <pet.icon className="h-8 w-8 text-white" />
              <span className="text-white">{pet.name}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}