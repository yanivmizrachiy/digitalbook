#!/data/data/com.termux/files/usr/bin/bash
echo -e "\e[36m[SYNC] מעבד PDFים לתוך המערכת...\e[0m"
mkdir -p pdf site/pdf site/generated
JSON="./site/generated/chapters.json"
echo "[" > "$JSON"
shopt -s nullglob
files=(./pdf/*.pdf)
for ((i=0; i<${#files[@]}; i++)); do
    f=$(basename "${files[$i]}")
    title=$(echo "$f" | sed -E 's/^[0-9]+[ _-]*//; s/\.pdf$//; s/[_-]/ /g')
    cp "${files[$i]}" "./site/pdf/$f"
    echo "  { \"id\": $((i+1)), \"title\": \"$title\", \"url\": \"pdf/$f\" }$( [ $((i+1)) -lt ${#files[@]} ] && echo "," )" >> "$JSON"
    echo -e "\e[32m   [+] נתפר בהצלחה: $title\e[0m"
done
echo "]" >> "$JSON"
