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

## Publicação na Netlify

O arquivo `netlify.toml` configura Node.js 24, o comando `npm run build`
e a pasta pública `dist`. Na Netlify, importe o repositório
`nida777/calendarios2027` e selecione a branch `main`.

Para publicar um build pronto usando a CLI autenticada:

```sh
netlify deploy --dir=dist --prod --no-build
```

As credenciais da Netlify devem ser fornecidas pelas configurações seguras do
ambiente ou pelo login da CLI; nunca pelo código-fonte.

## Publicação alternativa no GitHub Pages

O workflow `.github/workflows/pages.yml` permite uma publicação manual pelo
GitHub Actions, caso essa alternativa seja desejada. Nas configurações do
repositório, em **Pages**, a origem deve ser **GitHub Actions**. A publicação
requer permissão para configurar Pages e executar os workflows no repositório.

## Datas

Os nove feriados nacionais fixos são separados de Carnaval, Paixão de Cristo,
Páscoa e Corpus Christi. A abrangência das datas religiosas e dos pontos
facultativos depende da legislação local. Feriados estaduais e municipais
não estão incluídos.
