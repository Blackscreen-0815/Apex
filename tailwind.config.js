/* Nur nötig, wenn neue Tailwind-Klassen dazukommen. Farben kommen aus den CSS-Variablen der Themes. */
module.exports = {
  content: ['./index.html'],
  theme: { extend: { colors: {
    bg: 'rgb(var(--bg) / <alpha-value>)', card: 'rgb(var(--card) / <alpha-value>)', label: 'rgb(var(--label) / <alpha-value>)',
    label2: 'rgb(var(--label2) / var(--label2-a))', label3: 'rgb(var(--label2) / var(--label3-a))', sep: 'rgb(var(--sep) / var(--sep-a))',
    accent: 'rgb(var(--accent) / <alpha-value>)', ink: 'rgb(var(--accent-ink) / <alpha-value>)', onaccent: 'rgb(var(--on-accent) / <alpha-value>)',
    green: 'rgb(var(--green) / <alpha-value>)', orange: 'rgb(var(--orange) / <alpha-value>)', red: 'rgb(var(--red) / <alpha-value>)'
  } } }
};
