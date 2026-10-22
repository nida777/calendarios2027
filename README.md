# Calendários 2027

Site em português com os 12 meses de 2027, feriados nacionais brasileiros,
datas comemorativas móveis, visualização mensal e impressão em papel ou PDF.
Não exige cadastro, backend, banco de dados ou chaves de API.

## Desenvolvimento

Use Node.js 24 e npm:

```sh
export npm_config_cache=/workspace/.cache/npm
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

O build estático é gerado em `dist/`. Caminhos relativos permitem hospedar
o site tanto na raiz de um domínio quanto em `/calendarios2027/`.

## Publicação no GitHub Pages

O workflow `.github/workflows/pages.yml` testa, compila e publica o site quando
há um push para `main`. Nas configurações do repositório, em **Pages**, a origem
de publicação deve ser **GitHub Actions**. A publicação requer permissão para
configurar Pages e executar os workflows no repositório.

## Datas

Os nove feriados nacionais fixos são separados de Carnaval, Paixão de Cristo,
Páscoa e Corpus Christi. A abrangência das datas religiosas e dos pontos
facultativos depende da legislação local. Feriados estaduais e municipais
não estão incluídos.
