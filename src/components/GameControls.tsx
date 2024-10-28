import { Button } from '@/components/ui/button';
import { Heart, Pizza, Gamepad2, Droplets, RotateCcw, Moon, Sun } from 'lucide-react';

interface GameControlsProps {
  onFeed: () => void;
  onPlay: () => void;
  onClean: () => void;
  onToggleSleep: () => void;
  onReset: () => void;
  isAlive: boolean;
  isSleeping: boolean;
}

export default function GameControls({
  onFeed,
  onPlay,
  onClean,
  onToggleSleep,
  onReset,
  isAlive,
  isSleeping,
}: GameControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button
        variant="outline"
        size="lg"
        onClick={onFeed}
        disabled={!isAlive || isSleeping}
        className="h-16 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 transition-all"
      >
        <Pizza className="h-6 w-6 text-pink-400" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onPlay}
        disabled={!isAlive || isSleeping}
        className="h-16 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 transition-all"
      >
        <Gamepad2 className="h-6 w-6 text-green-400" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onClean}
        disabled={!isAlive || isSleeping}
        className="h-16 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 transition-all"
      >
        <Droplets className="h-6 w-6 text-blue-400" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onToggleSleep}
        disabled={!isAlive}
        className="h-16 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 transition-all"
      >
        {isSleeping ? (
          <Sun className="h-6 w-6 text-yellow-400" />
        ) : (
          <Moon className="h-6 w-6 text-indigo-400" />
        )}
      </Button>
      <Button
        variant="outline"
        size="lg"
        disabled={!isAlive}
        className="h-16 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 transition-all"
      >
        <Heart className="h-6 w-6 text-red-400" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onReset}
        className="h-16 bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 transition-all"
      >
        <RotateCcw className="h-6 w-6 text-purple-400" />
      </Button>
    </div>
  );
}