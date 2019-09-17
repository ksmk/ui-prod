const removeSpecial = NameFile => {
  NameFile = NameFile.replace("ó", "o");
  NameFile = NameFile.replace("Ó", "o");
  NameFile = NameFile.replace("ł", "l");
  NameFile = NameFile.replace("Ł", "l");
  NameFile = NameFile.replace("ń", "n");
  NameFile = NameFile.replace("Ń", "n");
  NameFile = NameFile.replace("ż", "z");
  NameFile = NameFile.replace("Ż", "z");
  NameFile = NameFile.replace("ź", "z");
  NameFile = NameFile.replace("Ź", "z");
  NameFile = NameFile.replace("Ć", "c");
  NameFile = NameFile.replace("ć", "c");
  NameFile = NameFile.replace("ę", "e");
  NameFile = NameFile.replace("Ę", "e");
  NameFile = NameFile.replace("Ś", "s");
  NameFile = NameFile.replace("ś", "s");
  return NameFile;
};

export const toUrl = value =>
  removeSpecial(
    encodeURIComponent(value)
      .replace(/%20/g, "-")
      .toLowerCase(),
  );
