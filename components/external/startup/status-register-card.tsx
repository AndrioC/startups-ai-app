interface Props {
  filledPercentages: { [key: string]: number };
  isRefetching: boolean;
}

export default function StatusRegisterCard({
  filledPercentages,
  isRefetching,
}: Props) {
  const totalBlocks = Object.keys(filledPercentages).length;
  const totalPercentage = Object.values(filledPercentages).reduce(
    (sum, val) => sum + val,
    0
  );
  const averagePercentage = totalPercentage / totalBlocks;

  const getColor = (percentage: number) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusTextAndColor = (average: number) => {
    if (average === 100)
      return { text: "Seu cadastro está completo!", color: "text-green-500" };
    if (average >= 50)
      return {
        text: "Seu cadastro está quase completo!",
        color: "text-yellow-500",
      };
    return { text: "Seu cadastro está incompleto!", color: "text-red-500" };
  };

  const status = getStatusTextAndColor(averagePercentage);

  if (isRefetching) {
    return (
      <div className="w-[300px] h-auto bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-2 gap-1">
        <div className="text-xs text-center font-bold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="w-[300px] h-auto bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-2 gap-1">
      <div className={`text-xs text-center font-bold ${status.color}`}>
        {status.text}
      </div>
      <div className="flex space-x-1 mt-1">
        {Object.values(filledPercentages).map((percentage, index) => (
          <div
            key={index}
            className="w-[37px] h-1.5 bg-gray-200 overflow-hidden"
          >
            <div
              className={`h-full ${getColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        ))}
      </div>
      <div className="text-sm text-center text-green-500 font-bold mt-1">
        {averagePercentage.toFixed(0)}%
      </div>
    </div>
  );
}
