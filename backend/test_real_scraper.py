import requests
import urllib.parse
import re

def search_real_places(query, city):
    results = []
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    
    # Engine 1: OpenStreetMap / Nominatim Places
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(query + ' in ' + city)}&format=json&addressdetails=1&extratags=1&limit=15"
    try:
        r = requests.get(url, headers=headers, timeout=6)
        if r.status_code == 200:
            for item in r.json():
                name = item.get('name') or (item.get('display_name', '').split(',')[0] if item.get('display_name') else "")
                if name and len(name) > 2 and not any(x['name'].lower() == name.lower() for x in results):
                    tags = item.get('extratags', {})
                    phone = tags.get('phone') or tags.get('contact:phone') or tags.get('phone:mobile')
                    website = tags.get('website') or tags.get('url')
                    addr_parts = item.get('display_name', '').split(',')
                    addr = ', '.join(addr_parts[1:4]).strip() if len(addr_parts) > 3 else f'{city}'
                    results.append({'name': name, 'phone': phone, 'address': addr, 'website': website})
    except Exception as e:
        print('Nominatim err:', e)

    # Engine 2: Real DuckDuckGo Search Snippet Scraper for real business listings in city
    try:
        ddg_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query + ' ' + city + ' phone contact website')}"
        res = requests.get(ddg_url, headers=headers, timeout=6)
        if res.status_code == 200:
            title_matches = re.findall(r'<a class="result__a" href="([^"]+)">(.*?)</a>', res.text)
            snippet_matches = re.findall(r'<a class="result__snippet"[^>]*>(.*?)</a>', res.text)
            
            for idx, (link, title_html) in enumerate(title_matches[:12]):
                clean_title = re.sub(r'<[^>]+>', '', title_html).strip()
                bname = clean_title.split('-')[0].split('|')[0].split(':')[0].strip()
                
                # Exclude non-business search junk
                if any(bad in bname.lower() for bad in ["top 10", "best 10", "list of", "where to", "places to eat", "tripadvisor"]):
                    continue

                if len(bname) > 3 and not any(r['name'].lower() == bname.lower() for r in results):
                    snip = re.sub(r'<[^>]+>', '', snippet_matches[idx]) if idx < len(snippet_matches) else ''
                    phone_match = re.search(r'(\+?\d{1,4}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})', snip)
                    found_phone = phone_match.group(0) if phone_match else None
                    
                    is_agg = any(agg in link.lower() for agg in ['justdial', 'sulekha', 'tripadvisor', 'zomato', 'swiggy', 'yellowpages', 'facebook', 'instagram', 'wikipedia', 'booking.com'])
                    web = None if is_agg else f"http://{re.sub(r'^https?://', '', link.strip())}"
                    results.append({'name': bname, 'phone': found_phone, 'address': f'Commercial Hub, {city}', 'website': web})
    except Exception as e:
        print('DDG Scraper err:', e)

    return results

if __name__ == '__main__':
    print("=== REAL LEADS FOR GALLE ===")
    for p in search_real_places("Restaurants", "Galle"):
        print(f"NAME: {p['name']} | PHONE: {p['phone']} | WEB: {p['website']}")

    print("\n=== REAL LEADS FOR MADURAI ===")
    for p in search_real_places("Restaurants", "Madurai"):
        print(f"NAME: {p['name']} | PHONE: {p['phone']} | WEB: {p['website']}")
