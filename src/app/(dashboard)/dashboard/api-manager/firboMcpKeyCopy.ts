/** FIRBO's least-privilege MCP key preset. Keep these labels in the existing API Manager. */
const COPY = {
  en: {
    title: "FIRBO MCP read-only key",
    create: "Generate a dedicated MCP key with health, quota, usage, models and combos read scopes only; no management or model-completion access.",
    convert: "Convert this existing key to FIRBO MCP read-only",
    convertHelp: "On save: replace ALL current scopes with the six MCP read scopes and block model completions. Existing management/write permissions will be removed. Do not convert a key used elsewhere.",
    confirm: "Replace all permissions on this API key with the restricted FIRBO MCP read-only preset? This may break other clients using this key.",
  },
  el: {
    title: "Κλειδί FIRBO MCP μόνο για ανάγνωση",
    create: "Δημιουργία αποκλειστικού MCP key για ανάγνωση health, quota, usage, models και combos, χωρίς διαχείριση ή εκτέλεση μοντέλων.",
    convert: "Μετατροπή του υπάρχοντος κλειδιού σε FIRBO MCP read-only",
    convertHelp: "Με την αποθήκευση αντικαθίστανται ΟΛΑ τα scopes με τα έξι περιορισμένα MCP scopes και αποκλείεται το model inference. Μην μετατρέψεις κλειδί που χρησιμοποιείται αλλού.",
    confirm: "Να αντικατασταθούν όλα τα δικαιώματα του API key με τα περιορισμένα FIRBO MCP read-only scopes; Άλλοι clients μπορεί να σταματήσουν να λειτουργούν.",
  },
  es: {
    title: "Clave FIRBO MCP de solo lectura",
    create: "Crea una clave dedicada con permisos de lectura para salud, cuota, uso, modelos y combos, sin gestión ni inferencia.",
    convert: "Convertir esta clave existente a FIRBO MCP de solo lectura",
    convertHelp: "Al guardar, se reemplazan TODOS los permisos por seis permisos MCP de lectura y se bloquea la inferencia. No conviertas una clave utilizada por otros clientes.",
    confirm: "¿Reemplazar todos los permisos de la clave con los seis permisos FIRBO MCP de solo lectura? Otros clientes pueden dejar de funcionar.",
  },
  fr: {
    title: "Clé FIRBO MCP en lecture seule",
    create: "Créer une clé dédiée avec uniquement les permissions de lecture santé, quotas, utilisation, modèles et combos, sans gestion ni inférence.",
    convert: "Convertir cette clé en FIRBO MCP lecture seule",
    convertHelp: "À l'enregistrement, TOUS les droits sont remplacés par six permissions MCP de lecture et l'inférence est bloquée. Ne modifiez pas une clé utilisée ailleurs.",
    confirm: "Remplacer toutes les permissions de cette clé par celles de FIRBO MCP en lecture seule ? D'autres clients peuvent cesser de fonctionner.",
  },
  de: {
    title: "FIRBO MCP-Schlüssel mit Lesezugriff",
    create: "Separaten Schlüssel nur für lesenden Zugriff auf Gesundheit, Kontingente, Nutzung, Modelle und Combos erstellen; ohne Verwaltung oder Inferenz.",
    convert: "Bestehenden Schlüssel in FIRBO MCP-Lesezugriff umwandeln",
    convertHelp: "Beim Speichern werden ALLE Berechtigungen durch sechs MCP-Leserechte ersetzt und Modell-Inferenz gesperrt. Keine anderweitig verwendeten Schlüssel umwandeln.",
    confirm: "Alle Berechtigungen dieses Schlüssels durch die FIRBO MCP-Leserechte ersetzen? Andere Clients können nicht mehr funktionieren.",
  },
  "pt-BR": {
    title: "Chave FIRBO MCP somente leitura",
    create: "Crie uma chave exclusiva com leitura de saúde, cotas, uso, modelos e combos, sem gestão nem inferência.",
    convert: "Converter esta chave para FIRBO MCP somente leitura",
    convertHelp: "Ao salvar, TODAS as permissões serão substituídas pelos seis escopos MCP de leitura; inferência será bloqueada. Não converta uma chave usada em outro lugar.",
    confirm: "Substituir todas as permissões desta chave pelos escopos de somente leitura FIRBO MCP? Outros clientes podem parar de funcionar.",
  },
  "zh-CN": {
    title: "FIRBO MCP 只读密钥",
    create: "创建专用密钥，仅允许读取健康、配额、用量、模型与组合，不允许管理或模型推理。",
    convert: "将现有密钥转换为 FIRBO MCP 只读密钥",
    convertHelp: "保存后，所有权限都将替换为六项 MCP 只读权限，并禁止模型推理。不要转换其他客户端正在使用的密钥。",
    confirm: "确定将此密钥全部权限替换为 FIRBO MCP 只读权限吗？其他客户端可能停止工作。",
  },
  ar: {
    title: "مفتاح FIRBO MCP للقراءة فقط",
    create: "أنشئ مفتاحًا مخصصًا لقراءة الحالة والحصص والاستخدام والنماذج والمجموعات، دون إدارة أو استدلال.",
    convert: "تحويل المفتاح الحالي إلى FIRBO MCP للقراءة فقط",
    convertHelp: "عند الحفظ، ستُستبدل جميع الصلاحيات بست صلاحيات MCP للقراءة فقط، وسيُمنع الاستدلال. لا تُحوّل مفتاحًا تستخدمه خدمات أخرى.",
    confirm: "هل تريد استبدال جميع صلاحيات المفتاح بصلاحيات FIRBO MCP للقراءة فقط؟ قد تتوقف الخدمات الأخرى عن العمل.",
  },
  tr: {
    title: "FIRBO MCP salt okunur anahtar",
    create: "Yönetim veya model çıkarımı olmadan yalnızca sağlık, kota, kullanım, model ve kombinasyon okuma yetkili anahtar oluştur.",
    convert: "Mevcut anahtarı FIRBO MCP salt okunur anahtara dönüştür",
    convertHelp: "Kaydedildiğinde TÜM yetkiler altı salt okunur MCP kapsamıyla değiştirilir ve model çıkarımı engellenir. Başka yerde kullanılan anahtarı dönüştürmeyin.",
    confirm: "Bu anahtarın tüm yetkileri FIRBO MCP salt okunur yetkileriyle değiştirilsin mi? Diğer istemciler çalışmayı durdurabilir.",
  },
} as const;

export function firboMcpKeyCopy(locale: string): typeof COPY.en {
  return (COPY[locale as keyof typeof COPY] ?? COPY.en) as typeof COPY.en;
}
