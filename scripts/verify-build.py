"""Check generated routes, image assets, forms and SEO without sending inquiries."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json

root = Path('dist')
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.tags=[]; self.feed(text)
    def handle_starttag(self, tag, attrs): self.tags.append((tag,dict(attrs)))

errors=[];pages=list(root.rglob('*.html'))
for file in pages:
    if file == root/'404.html': continue
    parsed=Page(file.read_text())
    if file.as_posix().startswith('dist/es/') or file.as_posix().startswith('dist/en/'):
        assert sum(tag=='h1' for tag,_ in parsed.tags)==1, f'{file}: expected one h1'
        assert any(tag=='main' and a.get('id')=='main' for tag,a in parsed.tags), f'{file}: missing skip target'
    for tag,a in parsed.tags:
        target=a.get('src') if tag in ('img','script') else a.get('href') if tag=='a' else None
        if not target or not target.startswith('/') or target.startswith('//'): continue
        path=root/unquote(urlsplit(target).path).lstrip('/')
        if not path.is_file() and not (path/'index.html').is_file(): errors.append(f'{file}: missing {target}')
        if tag=='img' and not a.get('alt') and not ('alt' in a and not a['alt'] and a.get('aria-hidden') == 'true'): errors.append(f'{file}: missing image description {target}')
for lang in ('es','en'):
    page=Page((root/lang/'contact/index.html').read_text())
    form=next(a for tag,a in page.tags if tag=='form')
    assert form.get('data-netlify')=='true' and form.get('name')=='contact'
    assert form.get('action')==f'/{lang}/thanks/'
    fields={a.get('name') for tag,a in page.tags if tag in ('input','textarea')}
    assert {'form-name','bot-field','name','email','message','type'}.issubset(fields)
    for group,category in [('product','product'),('portraits','portraits'),('events','concert')]:
        parsed=Page((root/lang/f'gallery/{group}/index.html').read_text())
        photo_srcs=[a['src'] for tag,a in parsed.tags if tag=='img' and a.get('src','').startswith('/photos/')]
        assert photo_srcs and all(s.startswith(f'/photos/{category}/') for s in photo_srcs), f'Wrong photos in {group}'
assert not errors, '\n'.join(errors)
print(f'PASS: {len(pages)} generated pages; local links/images; ES/EN forms; vertical taxonomy.')
