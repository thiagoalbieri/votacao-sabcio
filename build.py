# -*- coding: utf-8 -*-
"""Regera index.html (documento standalone) a partir de app.html (fragmento)."""
import io
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
frag = io.open("app.html", encoding="utf-8").read()
doc = (
    '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    "</head>\n<body>\n" + frag + "\n</body>\n</html>\n"
)
io.open("index.html", "w", encoding="utf-8").write(doc)
print("index.html regenerado")
