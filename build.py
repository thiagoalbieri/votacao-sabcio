# -*- coding: utf-8 -*-
"""Regera index.html (documento standalone) a partir de app.html (fragmento)."""
import io, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
frag = io.open("app.html", encoding="utf-8").read()
doc = ('<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
'
       '<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
'
       + frag + "
</body>
</html>
")
io.open("index.html", "w", encoding="utf-8").write(doc)
print("index.html regenerado")
