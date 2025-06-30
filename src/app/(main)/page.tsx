import { serverEnv } from "@/utils/env";

export const dynamic = "force-dynamic";

export default function Home() {
  const powerbiUrl = serverEnv.powerbiEmbedUrl;

  return (
    <div className="h-screen -my-6 -mx-4 md:-mx-6">
      {powerbiUrl ? (
        <iframe
          title="NCCRM DataHub Analytics"
          src={powerbiUrl}
          width="100%"
          height="100%"
          allowFullScreen
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>PowerBI dashboard not configured</p>
        </div>
      )}
    </div>
  );
}
