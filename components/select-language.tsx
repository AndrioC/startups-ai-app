import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function SelectLanguage() {
  const handleLanguageChange = (value: string) => {
    document.cookie = `NEXT_LOCALE=${value}; path=/`;
    window.location.reload();
  };
  return (
    <div className="w-full flex justify-end mb-4 text-gray-500">
      <Select
        defaultValue={
          typeof window !== "undefined"
            ? document.documentElement.lang
            : "pt-br"
        }
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt-br">PT-BR</SelectItem>
          <SelectItem value="en">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
