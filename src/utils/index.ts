import translations from "../translations.json";

const language = /[?&]en/.test(window.location.search) ? "en" : "de";

export const downloadFile = async (fileName: string, jsObject: object) => {
  const json = JSON.stringify(jsObject);
  const blob = new Blob([json], { type: "application/json" });
  const href = await URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getTranslation = (key: keyof typeof translations) => {
  const index = language === "de" ? 0 : 1;
  try {
    return (translations as { [key: string]: string[] })[key][index];
  } catch (error) {
    throw new Error(`Could not find translation for key ${key}`);
  }
};
