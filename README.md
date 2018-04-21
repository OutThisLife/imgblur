# ImgBlur

[View Demo](https://imgblur.herokuapp.com/)

Simple component coupled with a CLI that will lazy load your images w/ a blurry preview.

## Install

`
yarn add imgblur --dev
`

## Usage

The CLI will generate the preview images for you (appended with -tblur):

```json
{
  ...
  "build:img": "imgblur ./static/*"
  ...
}
```

Then, just use the component with the original path:

```jsx
<ImgBlur src='/static/sample.jpg' />
```

The rest is magic. It will lazy load (based on scroll position) with the preview set as the default image to show.
