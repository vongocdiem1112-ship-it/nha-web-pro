import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchBar = () => {
  return (
    <div className="bg-card shadow-card rounded-2xl p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Tìm theo địa điểm, dự án..."
            className="h-12"
          />
        </div>
        <Select>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Loại BĐS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Căn hộ</SelectItem>
            <SelectItem value="house">Nhà riêng</SelectItem>
            <SelectItem value="land">Đất nền</SelectItem>
            <SelectItem value="villa">Biệt thự</SelectItem>
          </SelectContent>
        </Select>
        <Button className="h-12 gradient-primary text-primary-foreground hover:opacity-90 transition-smooth">
          <Search className="w-5 h-5 mr-2" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
