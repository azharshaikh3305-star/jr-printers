import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

// Root store brand info aligned with metadata.json
const BASE_STORE_NAME = 'JR PRINTING WORKS - Custom Printing Studio';
const BASE_STORE_DESCRIPTION =
  'Official custom printing studio by Pro. Shaikh Sameer. T-Shirt Printing, Cup Printing, Pillow Printing, Bottle Printing, Key Chain Printing, Photo Frame Printing, and Mobile Back Covers. Contact: 7888162822 / 7888162824.';
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200';

/**
 * Utility function to set or create a <meta> tag in the document <head>
 */
const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
  let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Utility function to set canonical link tag
 */
const setCanonicalUrl = (url: string) => {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
};

/**
 * Utility function to inject or update Schema.org JSON-LD structured data
 */
const setJsonLd = (schema: object) => {
  let script = document.head.querySelector('script#seo-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
};

export const SEOManager: React.FC = () => {
  const { currentPage, selectedProduct, products, activeCategory } = useApp();

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentProduct =
      selectedProduct || (currentPage === 'product-detail' && products && products.length > 0 ? products[0] : null);

    let pageTitle = BASE_STORE_NAME;
    let pageDescription = BASE_STORE_DESCRIPTION;
    let ogType = 'website';
    let ogImage = DEFAULT_OG_IMAGE;
    let ogImageAlt = 'JR PRINTING WORKS Custom Merchandise Collection';
    let canonicalUrl = `${origin}${pathname}`;
    let schemaData: object = {};

    switch (currentPage) {
      case 'product-detail': {
        if (currentProduct) {
          pageTitle = `${currentProduct.name} (₹${currentProduct.basePrice}) · JR PRINTING WORKS`;
          const cleanDesc = currentProduct.description ? currentProduct.description.slice(0, 155) : '';
          pageDescription = `${currentProduct.tagline ? currentProduct.tagline + ' — ' : ''}${cleanDesc}. Buy online with vibrant custom HD printing.`;
          ogType = 'product';
          if (currentProduct.images && currentProduct.images.length > 0) {
            ogImage = currentProduct.images[0];
            ogImageAlt = currentProduct.name;
          }
          canonicalUrl = `${origin}${pathname}?product=${encodeURIComponent(currentProduct.id)}`;

          // Schema.org Product Rich Snippet
          schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: currentProduct.name,
            image: currentProduct.images || [ogImage],
            description: currentProduct.description,
            sku: `JR-${currentProduct.id}`,
            brand: {
              '@type': 'Brand',
              name: 'JR PRINTING WORKS',
            },
            offers: {
              '@type': 'Offer',
              url: canonicalUrl,
              priceCurrency: 'INR',
              price: currentProduct.basePrice,
              availability: currentProduct.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'JR PRINTING WORKS',
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: currentProduct.rating || 5.0,
              reviewCount: currentProduct.reviewCount || 1,
            },
          };
        }
        break;
      }

      case 'shop': {
        const categoryLabel =
          activeCategory && activeCategory !== 'all'
            ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
            : 'All Custom Products';
        pageTitle = `${categoryLabel} · Online Custom Printing Store · JR PRINTING WORKS`;
        pageDescription = `Explore high-grade personalized T-shirts, Magic Mugs, Sequin Pillows, Aluminum Bottles, Key Chains, and Wall Frames. Crafted by Pro. Shaikh Sameer.`;
        ogImage = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1200';
        ogImageAlt = 'Custom Printed Gifts and Merchandise';
        canonicalUrl = `${origin}${pathname}?page=shop${activeCategory && activeCategory !== 'all' ? `&category=${encodeURIComponent(activeCategory)}` : ''}`;
        break;
      }

      case 'designer': {
        pageTitle = 'Live 3D Custom Printing Studio · Upload & Design · JR PRINTING WORKS';
        pageDescription = 'Customize T-Shirts, Cups, Magic Pillows & Bottles in 3D real-time. Upload your photos, add text, select colors, and order directly online.';
        ogImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200';
        ogImageAlt = 'Interactive 3D Merchandise Customizer';
        canonicalUrl = `${origin}${pathname}?page=designer`;
        break;
      }

      case 'about': {
        pageTitle = 'About Us · Pro. Shaikh Sameer | JR PRINTING WORKS';
        pageDescription = 'Discover JR PRINTING WORKS, founded by Pro. Shaikh Sameer. Learn about our commitment to premium DTG, sublimation, and scratch-resistant custom printing.';
        canonicalUrl = `${origin}${pathname}?page=about`;
        break;
      }

      case 'contact': {
        pageTitle = 'Contact & WhatsApp Support (+91 7888162822) · JR PRINTING WORKS';
        pageDescription = 'Need custom printing assistance or bulk ordering? Contact Pro. Shaikh Sameer directly via WhatsApp (+91 7888162822 / 7888162824). Fast India-wide shipping.';
        canonicalUrl = `${origin}${pathname}?page=contact`;
        break;
      }

      case 'login': {
        pageTitle = 'Sign In / Register Customer Account · JR PRINTING WORKS';
        pageDescription = 'Sign in or create a JR PRINTING WORKS account to track orders, manage saved custom 3D designs, and access quick reorders.';
        canonicalUrl = `${origin}${pathname}?page=login`;
        break;
      }

      case 'account': {
        pageTitle = 'My Account & Order History · JR PRINTING WORKS';
        pageDescription = 'View your active printing jobs, order status, shipping trackings, and personalized profile settings.';
        canonicalUrl = `${origin}${pathname}?page=account`;
        break;
      }

      case 'checkout': {
        pageTitle = 'Secure Checkout · UPI & Card Payment · JR PRINTING WORKS';
        pageDescription = 'Review order items, enter delivery address, and complete your purchase securely with instant UPI QR & card payments.';
        canonicalUrl = `${origin}${pathname}?page=checkout`;
        break;
      }

      case 'order-success': {
        pageTitle = 'Order Confirmed · Printing in Progress · JR PRINTING WORKS';
        pageDescription = 'Thank you for your order! Your custom merchandise has been placed into production queue at JR PRINTING WORKS.';
        canonicalUrl = `${origin}${pathname}?page=order-success`;
        break;
      }

      case 'admin': {
        pageTitle = 'Admin Management Console · JR PRINTING WORKS';
        pageDescription = 'Internal order dispatch, inventory management, and store control panel.';
        canonicalUrl = `${origin}${pathname}?page=admin`;
        break;
      }

      case 'home':
      default: {
        pageTitle = BASE_STORE_NAME;
        pageDescription = BASE_STORE_DESCRIPTION;
        canonicalUrl = `${origin}${pathname}`;

        // Schema.org LocalBusiness / Store structured data
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'JR PRINTING WORKS',
          description: BASE_STORE_DESCRIPTION,
          image: DEFAULT_OG_IMAGE,
          founder: {
            '@type': 'Person',
            name: 'Pro. Shaikh Sameer',
          },
          telephone: ['+91 7888162822', '+91 7888162824'],
          priceRange: '₹₹',
          currenciesAccepted: 'INR',
          paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, NetBanking',
          url: origin,
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
          },
        };
        break;
      }
    }

    // 1. Update Document Title
    document.title = pageTitle;

    // 2. Standard Meta Description
    setMetaTag('name', 'description', pageDescription);

    // 3. OpenGraph Tags
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:alt', ogImageAlt);
    setMetaTag('property', 'og:site_name', BASE_STORE_NAME);

    // Product-specific OpenGraph tags
    if (ogType === 'product' && selectedProduct) {
      setMetaTag('property', 'product:price:amount', String(selectedProduct.basePrice));
      setMetaTag('property', 'product:price:currency', 'INR');
      setMetaTag('property', 'product:availability', selectedProduct.inStock ? 'in stock' : 'out of stock');
    }

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:image:alt', ogImageAlt);

    // 5. Canonical Link Tag
    setCanonicalUrl(canonicalUrl);

    // 6. Schema.org JSON-LD Structured Data
    if (Object.keys(schemaData).length > 0) {
      setJsonLd(schemaData);
    }
  }, [currentPage, selectedProduct, activeCategory]);

  return null;
};
