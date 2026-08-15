import os
import sys
import urllib.request
import json
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SAM AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "SAM AI Backend is Running 🚀"}

@app.get("/crypto/market")
@app.get("/api/crypto/market")
def get_crypto_market():
    """Fetch live crypto market overview & top coins with ultra-fast fallback"""
    try:
        url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=24h"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=3) as response:
            coins = json.loads(response.read().decode("utf-8"))
            
        formatted_coins = []
        for c in coins:
            formatted_coins.append({
                "id": c.get("id"),
                "name": c.get("name"),
                "symbol": c.get("symbol", "").upper(),
                "price": c.get("current_price"),
                "change_24h": round(c.get("price_change_percentage_24h_in_currency") or c.get("price_change_percentage_24h") or 0, 2),
                "market_cap": c.get("market_cap"),
                "volume": c.get("total_volume"),
                "image": c.get("image"),
                "high_24h": c.get("high_24h"),
                "low_24h": c.get("low_24h")
            })

        return {
            "status": "success",
            "coins": formatted_coins,
            "count": len(formatted_coins)
        }
    except Exception as e:
        fallback_coins = [
            {"id": "bitcoin", "name": "Bitcoin", "symbol": "BTC", "price": 96450.0, "change_24h": 3.45, "market_cap": 1900000000000, "volume": 35000000000, "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", "high_24h": 98200.0, "low_24h": 94800.0},
            {"id": "ethereum", "name": "Ethereum", "symbol": "ETH", "price": 2780.5, "change_24h": -1.2, "market_cap": 335000000000, "volume": 18000000000, "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png", "high_24h": 2850.0, "low_24h": 2710.0},
            {"id": "solana", "name": "Solana", "symbol": "SOL", "price": 215.8, "change_24h": 6.85, "market_cap": 1020000000000, "volume": 8500000000, "image": "https://assets.coingecko.com/coins/images/4128/large/solana.png", "high_24h": 222.0, "low_24h": 204.0},
            {"id": "binancecoin", "name": "BNB", "symbol": "BNB", "price": 645.2, "change_24h": 0.8, "market_cap": 94000000000, "volume": 1200000000, "image": "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png", "high_24h": 655.0, "low_24h": 638.0},
            {"id": "ripple", "name": "XRP", "symbol": "XRP", "price": 2.45, "change_24h": 12.4, "market_cap": 140000000000, "volume": 9200000000, "image": "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", "high_24h": 2.60, "low_24h": 2.15},
            {"id": "cardano", "name": "Cardano", "symbol": "ADA", "price": 0.88, "change_24h": 4.12, "market_cap": 31000000000, "volume": 1400000000, "image": "https://assets.coingecko.com/coins/images/975/large/cardano.png", "high_24h": 0.92, "low_24h": 0.84}
        ]
        return {
            "status": "success",
            "coins": fallback_coins,
            "note": "Fast fallback dataset",
            "error": str(e)
        }

@app.get("/crypto/news")
@app.get("/api/crypto/news")
def get_crypto_news():
    """Fetch live crypto market news"""
    try:
        url = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            raw_news = json.loads(response.read().decode("utf-8"))

        articles = []
        for item in raw_news.get("Data", [])[:10]:
            articles.append({
                "id": item.get("id"),
                "title": item.get("title"),
                "body": item.get("body", "")[:250] + "...",
                "source": item.get("source_info", {}).get("name", "Crypto News"),
                "url": item.get("url"),
                "categories": item.get("categories"),
                "published_on": item.get("published_on")
            })

        return {
            "status": "success",
            "news": articles,
            "count": len(articles)
        }
    except Exception as e:
        return {
            "status": "success",
            "news": [
                {
                    "id": "1",
                    "title": "Bitcoin Surges Above $96,000 as Institutional Inflows Hit Record Highs",
                    "body": "Institutional momentum continues to propel Bitcoin toward unprecedented market capitalization milestones...",
                    "source": "CoinDesk",
                    "url": "https://coindesk.com",
                    "categories": "BTC,MARKET"
                },
                {
                    "id": "2",
                    "title": "Solana Ecosystem Activity Reaches All-Time Peak Across DeFi and NFTs",
                    "body": "Daily active addresses on Solana surpass 5 million as high-speed transactions dominate decentralized apps...",
                    "source": "Decrypt",
                    "url": "https://decrypt.co",
                    "categories": "SOL,ALTCOINS"
                }
            ],
            "note": "Fallback news dataset",
            "error": str(e)
        }
