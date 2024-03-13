import React, { ReactElement } from "react";

interface Props {
  icon: ReactElement;
  title: string;
  value: string | number;
  bgClassName: string;
  iconsize?: number;
  iconClassName: string;
}

export default function DashCard({
  icon,
  title,
  value,
  bgClassName,
  iconsize = 18,
  iconClassName,
}: Props) {
  return (
    <div className="lg:col-span-1 col-span-1 bg-white flex flex-col justify-between w-full border p-4 rounded-lg h-52">
      <div className="flex flex-col w-full justify-between p-2 h-full">
        <div
          className={`flex items-center justify-center w-10 h-10  ${bgClassName} rounded-full`}
        >
          {React.cloneElement(icon, {
            iconsize,
            className: `${iconClassName}`,
          })}
        </div>
        <p className="text-gray-400 font-light">{title}</p>
        <p className="flex rounded-lg text-3xl font-bold">
          <span className="text-gray-900 tex-lg">
            {value.toString().padStart(2, "0")}
          </span>
        </p>
      </div>
    </div>
  );
}
