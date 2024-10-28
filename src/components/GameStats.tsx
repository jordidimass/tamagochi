import { Progress } from '@/components/ui/progress';

interface GameStatsProps {
  stats: {
    hunger: number;
    happiness: number;
    health: number;
    cleanliness: number;
  };
}

export default function GameStats({ stats }: GameStatsProps) {
  return (
    <div className="space-y-3">
      {Object.entries(stats).map(([stat, value]) => (
        <div key={stat}>
          <div className="flex justify-between text-xs text-white/80 mb-1">
            <span className="capitalize">{stat}</span>
            <span>{value}%</span>
          </div>
          <Progress value={value} className="h-2" />
        </div>
      ))}
    </div>
  );
}