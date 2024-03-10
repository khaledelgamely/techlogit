export const styleLastWord = (text) => {
  const words = text.split(" ");
  if (words.length < 2) {
  }
  const lastWord = words.pop();
  const styledLastWord = <span style={{ color: "#1B75BC" }}>{lastWord}</span>;
  const styledText = (
    <span>
      {words.join(" ")} {styledLastWord}
    </span>
  );
  return styledText;
};
