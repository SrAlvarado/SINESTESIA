# SINESTESIA · Quién está aquí?

Web interactiva para entender la sinestesia (en concreto la cromestesia, oír colores) a través de Lucho RK y de su mixtape *Quién está aquí?* (2024): nueve canciones, nueve colores, y el blanco como suma de todos.

## Recorrido

1. **Portada.** Lucho recortado en tres capas de luz a partir de una foto. El cursor separa las capas; el scroll las funde y la portada se invierte a negro con la respuesta: *No son colores. Es el blanco.*
2. **Un sentido enciende otro.** Qué es la sinestesia. Una luz de color sigue al cursor.
3. **¿De qué color suena?** Las nueve canciones. Cada una tiñe la pantalla de su color, el borde late a su tempo y, con el sonido activado, suena el preview de 30 s.
4. **Dos zonas que se tocan.** Animación comparando un cerebro típico con uno sinestésico: la señal del oído cruza a V4 y se ve color.
5. **Cierre.** Nueve cartulinas de color que se queman desde el centro hasta dejar el blanco, con enlace al disco en Spotify.

## Colores de las canciones

Investigados a partir de las portadas monocromas que el propio Lucho eligió para sus singles, de las letras y del estudio de Palmer y Schloss (PNAS, 2013) sobre asociaciones música-color.

| # | Canción | Color | Por qué |
|---|---|---|---|
| 01 | Big Checks | rojo | El rojo de la portada de 1STEP, su otro trap de presentación |
| 02 | La otra de Juacko | gris violeta | El color de la portada de Luluna, su canción nocturna |
| 03 | Aiaiai | terracota | Portada real del single |
| 04 | Caramelo | ámbar | La letra: whisky caramelo, de noche, luz apagada |
| 05 | Cosquilleo | azul eléctrico | El azul de la portada de Lucy |
| 06 | Un añito más | celeste | Balada lenta y tierna; la palabra que usa Lucho |
| 07 | Manley | gris cálido | La única letra del disco que nombra un color: gris |
| 08 | Esos Ojitos | lila | Portada real del single |
| 09 | Aquí estoy | blanco | La suma |

## Cómo verla

Es HTML, CSS y JavaScript sin dependencias ni build. Abre `index.html` o sirve la carpeta:

```
python3 -m http.server 8000
```

Las fuentes se cargan de Google Fonts. Los previews de audio se piden a la API pública de iTunes (30 segundos por canción, servidos por Apple) y solo suenan tras pulsar «Activar sonido».

## Estructura

```
index.html
assets/css/style.css
assets/js/main.js
assets/img/lucho_l1.png  lucho_l2.png  lucho_l3.png   # capas de la silueta
INFO/    documento base sobre sinestesia y Lucho RK
IMAGES/  material fotográfico de partida
```
