import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-1 -mt-4">  {/* Added negative margin top */}
      <div className="flex justify-between items-start"> {/* Changed to items-start */}
        <div className="space-y-0.5"> {/* Added container for title and description */}
          <h1 className="text-title font-extrabold leading-117 text-brand-black">
            {title}
          </h1>
          {description && (
            <p className="text-sm-plus font-extrabold leading-117 text-brand-gray">
              {description}
            </p>
          )}
        </div>
        <Button 
          className="bg-[#AC0000] text-white" 
          variant="solid"
          onPress={() => router.push('/situational-reporting/summary')}
        >
          View Overall Summary
        </Button>
      </div>
    </div>
  );
}