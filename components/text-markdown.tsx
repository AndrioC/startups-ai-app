import React from "react";
import ReactMarkdown from "react-markdown";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  text: string;
}

export default function TextMarkdown({ text }: Props) {
  return (
    <Card className="bg-[#E5E7E7] rounded-lg shadow-md p-6 h-[800px] overflow-y-auto border-2 border-[#A5B5C1] custom-scrollbar">
      <CardContent className="h-full overflow-y-auto pr-4">
        <ReactMarkdown
          components={{
            h1: (props) => (
              <h1 className="text-2xl font-bold mb-4 mt-6 block" {...props} />
            ),
            h2: (props) => (
              <h2
                className="text-xl font-semibold mb-3 mt-5 block"
                {...props}
              />
            ),
            h3: (props) => (
              <h3
                className="text-lg font-semibold mb-2 mt-4 block"
                {...props}
              />
            ),
            h4: (props) => (
              <h4
                className="text-base font-semibold mb-2 mt-3 block"
                {...props}
              />
            ),
            p: (props) => <p className="mb-4 text-gray-500" {...props} />,
            ul: (props) => (
              <ul
                className="list-disc pl-5 mb-4 mt-2 text-gray-500"
                {...props}
              />
            ),
            ol: (props) => (
              <ol className="list-decimal pl-5 mb-4 mt-2" {...props} />
            ),
            li: (props) => <li className="mb-1" {...props} />,
            strong: (props) => (
              <strong className="font-semibold text-gray-600" {...props} />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}
