import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import StartMenu from './StartMenu';
import GameStats from './GameStats';
import GameControls from './GameControls';

const colorShades = {
  yellow: ['#FFF9C4', '#FFEB3B', '#FBC02D'],
  orange: ['#FFE0B2', '#FF9800', '#F57C00'],
  red: ['#FFCDD2', '#F44336', '#D32F2F'],
};

const createInitialState = (petStages: string[]) => ({
  hunger: 50,
  happiness: 50,
  health: 100,
  cleanliness: 100,
  age: 0,
  isSleeping: false,
  mood: 'neutral',
  evolutionStage: 0,
  color: 'yellow',
  isAlive: true,
  causeOfDeath: '',
  stages: petStages,
});

export default function Tamagotchi() {
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedPet) {
      const savedState = localStorage.getItem(`tamagotchiState_${selectedPet.id}`);
      if (savedState) {
        setState(JSON.parse(savedState));
      } else {
        setState(createInitialState(selectedPet.stages));
      }
    }
  }, [selectedPet]);

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState((prev: any) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (!state) return;

    const timer = setInterval(() => {
      setState((prev: any) => {
        if (!prev.isAlive) return prev;

        const next = { ...prev };

        if (next.age % 5 === 0 && !next.isSleeping) {
          next.hunger = Math.max(next.hunger - 1, 0);
          next.happiness = Math.max(next.happiness - 1, 0);
          next.cleanliness = Math.max(next.cleanliness - 1, 0);
        }
        next.age += 1;

        // Health logic
        if (next.hunger < 20 || next.happiness < 20 || next.cleanliness < 20) {
          next.health = Math.max(next.health - 1, 0);
        } else if (next.hunger > 80 && next.happiness > 80 && next.cleanliness > 80) {
          next.health = Math.min(next.health + 1, 100);
        }

        // Evolution stages
        if (next.age === 50 && next.evolutionStage < 1) {
          next.evolutionStage = 1;
          toast({
            title: "Evolution!",
            description: `Your ${selectedPet.name.toLowerCase()} has evolved!`,
          });
        }
        if (next.age === 100 && next.evolutionStage < 2) {
          next.evolutionStage = 2;
          toast({
            title: "Evolution!",
            description: `Your ${selectedPet.name.toLowerCase()} has evolved again!`,
          });
        }
        if (next.age === 150 && next.evolutionStage < 3) {
          next.evolutionStage = 3;
          toast({
            title: "Evolution!",
            description: `Your ${selectedPet.name.toLowerCase()} has reached its final form!`,
          });
        }

        // Color changes
        if (next.age === 200) next.color = 'orange';
        if (next.age === 500) next.color = 'red';

        // Check death conditions
        if (next.health === 0 && next.isAlive) {
          next.isAlive = false;
          if (next.hunger === 0) {
            next.causeOfDeath = 'Starvation';
          } else if (next.happiness === 0) {
            next.causeOfDeath = 'Loneliness';
          } else if (next.cleanliness === 0) {
            next.causeOfDeath = 'Illness';
          } else {
            next.causeOfDeath = 'Old age';
          }
          toast({
            title: "Game Over",
            description: `Your pet has died from ${next.causeOfDeath.toLowerCase()}. 😢`,
            variant: "destructive",
          });
        }

        localStorage.setItem(`tamagotchiState_${selectedPet.id}`, JSON.stringify(next));
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, selectedPet, toast]);

  const feed = useCallback(() => {
    if (state.hunger >= 100) {
      toast({
        title: "Can't feed",
        description: "Your pet is already full!",
      });
      return;
    }
    updateState({ hunger: Math.min(state.hunger + 10, 100) });
    toast({
      title: "Yummy!",
      description: "Your pet enjoyed the meal! 🍕",
    });
  }, [state?.hunger, updateState, toast]);

  const play = useCallback(() => {
    if (state.happiness >= 100) {
      toast({
        title: "Too tired",
        description: "Your pet needs some rest!",
      });
      return;
    }
    updateState({ happiness: Math.min(state.happiness + 10, 100) });
    toast({
      title: "Fun time!",
      description: "Your pet had fun playing! 🎮",
    });
  }, [state?.happiness, updateState, toast]);

  const clean = useCallback(() => {
    if (state.cleanliness >= 100) {
      toast({
        title: "Already clean",
        description: "Your pet is squeaky clean!",
      });
      return;
    }
    updateState({ cleanliness: Math.min(state.cleanliness + 10, 100) });
    toast({
      title: "Splash!",
      description: "Your pet is now clean! 🚿",
    });
  }, [state?.cleanliness, updateState, toast]);

  const toggleSleep = useCallback(() => {
    updateState({ isSleeping: !state.isSleeping });
    toast({
      title: state.isSleeping ? "Rise and shine!" : "Sweet dreams!",
      description: state.isSleeping ? "Your pet woke up! 🌞" : "Your pet is sleeping... 💤",
    });
  }, [state?.isSleeping, updateState, toast]);

  const resetGame = useCallback(() => {
    const newState = createInitialState(selectedPet.stages);
    setState(newState);
    localStorage.removeItem(`tamagotchiState_${selectedPet.id}`);
    toast({
      title: "New game",
      description: "Starting a new game with a fresh pet! 🥚",
    });
  }, [selectedPet, toast]);

  if (!selectedPet) {
    return <StartMenu onSelectPet={setSelectedPet} />;
  }

  if (!state) {
    return null;
  }

  const getPetColor = () => {
    const shades = colorShades[state.color] || colorShades.yellow;
    if (state.health > 66) return shades[2];
    if (state.health > 33) return shades[1];
    return shades[0];
  };

  const getPetSize = () => {
    const sizes = ['text-4xl', 'text-5xl', 'text-6xl', 'text-7xl'];
    return sizes[state.evolutionStage] || sizes[0];
  };

  const getPetEmoji = () => {
    if (!state.isAlive) return '💀';
    if (state.isSleeping) return '💤';
    return state.stages[state.evolutionStage] || '🥚';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 w-full max-w-sm">
      <div className="bg-black/80 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/80 text-sm">Age: {state.age}</span>
          <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
            {state.isAlive ? (state.isSleeping ? '💤' : '❤️') : '💀'}
          </span>
        </div>
        
        <div className="flex justify-center items-center h-32 mb-4">
          <span 
            className={`${getPetSize()} transition-all duration-300`}
            style={{ color: getPetColor() }}
          >
            {getPetEmoji()}
          </span>
        </div>

        <GameStats stats={{
          hunger: state.hunger,
          happiness: state.happiness,
          health: state.health,
          cleanliness: state.cleanliness,
        }} />
      </div>

      <GameControls
        onFeed={feed}
        onPlay={play}
        onClean={clean}
        onToggleSleep={toggleSleep}
        onReset={resetGame}
        isAlive={state.isAlive}
        isSleeping={state.isSleeping}
      />
    </div>
  );
}