import { Layout } from "@/components/layout/Layout";

const tops = [
  { size: "XS", fr: "34/36", poitrine: "80-84", taille: "60-64" },
  { size: "S",  fr: "36/38", poitrine: "84-88", taille: "64-68" },
  { size: "M",  fr: "38/40", poitrine: "88-92", taille: "68-72" },
  { size: "L",  fr: "40/42", poitrine: "92-96", taille: "72-76" },
  { size: "XL", fr: "42/44", poitrine: "96-100", taille: "76-80" },
  { size: "XXL",fr: "44/46", poitrine: "100-106", taille: "80-86" },
];

const bottoms = [
  { size: "XS", fr: "34/36", hanches: "86-90", taille: "60-64" },
  { size: "S",  fr: "36/38", hanches: "90-94", taille: "64-68" },
  { size: "M",  fr: "38/40", hanches: "94-98", taille: "68-72" },
  { size: "L",  fr: "40/42", hanches: "98-102", taille: "72-76" },
  { size: "XL", fr: "42/44", hanches: "102-106", taille: "76-80" },
  { size: "XXL",fr: "44/46", hanches: "106-112", taille: "80-86" },
];

const GuideTaillesPage = () => (
  <Layout>
    <div className="container-custom px-4 py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-2">Guide des tailles</h1>
      <p className="text-muted-foreground mb-10">Toutes les mesures sont en centimètres (cm).</p>

      <div className="space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Hauts & Robes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-4 py-3 rounded-tl-lg font-semibold">Taille</th>
                  <th className="text-left px-4 py-3 font-semibold">FR</th>
                  <th className="text-left px-4 py-3 font-semibold">Poitrine</th>
                  <th className="text-left px-4 py-3 rounded-tr-lg font-semibold">Taille</th>
                </tr>
              </thead>
              <tbody>
                {tops.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="px-4 py-3 font-medium">{row.size}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.fr}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.poitrine}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.taille}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Bas & Jupes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-4 py-3 rounded-tl-lg font-semibold">Taille</th>
                  <th className="text-left px-4 py-3 font-semibold">FR</th>
                  <th className="text-left px-4 py-3 font-semibold">Hanches</th>
                  <th className="text-left px-4 py-3 rounded-tr-lg font-semibold">Taille</th>
                </tr>
              </thead>
              <tbody>
                {bottoms.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="px-4 py-3 font-medium">{row.size}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.fr}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.hanches}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.taille}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-primary/5 rounded-xl p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Comment prendre ses mesures ?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong>Poitrine</strong> : mesurez à l'endroit le plus fort, sous les bras.</li>
            <li><strong>Taille</strong> : mesurez à l'endroit le plus fin, au-dessus du nombril.</li>
            <li><strong>Hanches</strong> : mesurez à l'endroit le plus fort, environ 20 cm sous la taille.</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default GuideTaillesPage;
