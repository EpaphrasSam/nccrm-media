export const dynamic = "force-dynamic";

export default function Home() {
  const powerbiUrl = process.env.POWERBI_EMBED_URL;

  return (
    <div className="h-screen -my-6 -mx-4 md:-mx-6">
      {powerbiUrl ? (
        <iframe
          title="NCCRM DataHub Analytics"
          src={powerbiUrl}
          width="100%"
          height="100%"
          allowFullScreen
          // loading="lazy"
          // sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
          // style={{ border: "none" }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>PowerBI dashboard not configured</p>
        </div>
      )}
    </div>
  );
}
