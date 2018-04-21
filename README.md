# ImgBlur ([demo](https://imgblur.herokuapp.com/))

Simple component coupled with a CLI that will lazy load your images w/ a blurry preview.

## Usage

The CLI will generate the preview images for you (appended with -tblur):

```
$ imgblur ./static/*.jpg
```

Then, just use the component with the original path:

```jsx
<ImgBlur src='/static/sample.jpg' />
```

The rest is magic. It will lazy load (based on scroll position) with the preview set as the default image to show.

## Use it w/ your build

I'd recommend adding it to your build process, with something like:

```json
{
  ...
  "build:img": "imgblur ./static/*"
  ...
}
```
