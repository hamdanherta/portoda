import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import CategoryFilter from '../Components/CategoryFilter';
import PortfolioGrid from '../Components/PortfolioGrid';
import DetailModal from '../Components/DetailModal';
import AdminDashboard from '../Components/AdminDashboard';
import InfoModal from '../Components/InfoModal';
import Footer from '../Components/Footer';
import { portfolioService } from '../services/portfolioService';
import { LanguageProvider } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeNavModal, setActiveNavModal] = useState(null); // 'profil' | 'pengalaman' | 'dokumen' | 'sertifikat' | 'kontak' | null

  // Halaman Daftar Karya vs Beranda
  const [isFullGallery, setIsFullGallery] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // In-memory instant filtering (responsif, tanpa lag / network latency)
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    if (activeCategory !== 'all') {
      result = result.filter(i => i.category === activeCategory);
    }

    if (activeSubcategory !== 'all') {
      const reqSub = activeSubcategory.toLowerCase().trim();
      result = result.filter(item => {
        const itemSub = (item.subcategory || '').toLowerCase().trim();
        return item.subcategory === activeSubcategory ||
               itemSub.includes(reqSub) ||
               reqSub.includes(itemSub) ||
               (reqSub.includes('kemasan') && itemSub.includes('kemasan')) ||
               (reqSub.includes('packaging') && itemSub.includes('kemasan')) ||
               (reqSub.includes('poster') && itemSub.includes('poster')) ||
               (reqSub.includes('banner') && itemSub.includes('banner')) ||
               (reqSub.includes('logo') && itemSub.includes('logo')) ||
               (reqSub.includes('lain') && itemSub.includes('lain')) ||
               (reqSub.includes('other') && itemSub.includes('lain'));
      });
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        const title = (item.title || '').toLowerCase();
        const titleEn = (item.title_en || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const descEn = (item.description_en || '').toLowerCase();
        const subcat = (item.subcategory || '').toLowerCase();
        const subcatEn = (item.subcategory_en || '').toLowerCase();
        const tools = (item.tools_used || '').toLowerCase();
        const method = (item.development_method || '').toLowerCase();
        const tagsStr = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';

        return title.includes(q) ||
               titleEn.includes(q) ||
               desc.includes(q) ||
               descEn.includes(q) ||
               subcat.includes(q) ||
               subcatEn.includes(q) ||
               tools.includes(q) ||
               method.includes(q) ||
               tagsStr.includes(q);
      });
    }

    return result;
  }, [allItems, activeCategory, activeSubcategory, searchQuery]);

  // Hook scroll reveal saat scroll kebawah & keatas
  useScrollReveal([filteredItems, activeCategory, activeSubcategory, searchQuery, loading, isFullGallery, currentPage]);

  // URL Hash/Query Listener untuk membuka Dashboard Admin via URL (misal: #admin atau ?admin=true)
  useEffect(() => {
    const checkAdminUrl = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#admin' || search.includes('admin=true') || search.includes('admin=1')) {
        setIsAdminOpen(true);
      }
    };

    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);
    return () => window.removeEventListener('hashchange', checkAdminUrl);
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  // Fetch portfolio items dari backend
  const loadPortfolioData = async () => {
    setLoading(true);
    try {
      const allData = await portfolioService.getItems();
      setAllItems(allData || []);
    } catch (err) {
      console.error('Failed to load portfolio items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSubcategory, searchQuery]);

  // CRUD Actions for Admin
  const handleCreateItem = async (newItemData) => {
    await portfolioService.createItem(newItemData);
    await loadPortfolioData();
  };

  const handleUpdateItem = async (id, updatedFields) => {
    await portfolioService.updateItem(id, updatedFields);
    await loadPortfolioData();
  };

  const handleDeleteItem = async (id) => {
    await portfolioService.deleteItem(id);
    await loadPortfolioData();
  };

  const handleResetMock = async () => {
    await portfolioService.resetToMockData();
    await loadPortfolioData();
  };

  const handleResetFilter = () => {
    setActiveCategory('all');
    setActiveSubcategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const scrollToGallery = () => {
    const galleryElem = document.getElementById('gallery-section');
    if (galleryElem) {
      galleryElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMoreWorks = () => {
    setIsFullGallery(true);
    setCurrentPage(1);
    scrollToGallery();
  };

  const handleBackToHome = () => {
    setIsFullGallery(false);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LanguageProvider>
      <Head title="Portoda - Portofolio Hamdani (Desain Grafis, Multimedia & Aplikasi)" />
      <div className="app-container" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}>
        {/* Background Page Element (#FFF3DD Page Background - Soft Blurred Backdrop) */}
        <img
          src="/brandingelement.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'fixed',
            right: '-660px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1400px',
            height: 'auto',
            filter: 'blur(30px)',
            imageRendering: 'high-quality',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Header Navigation dengan Menu: Pengalaman Kerja, Dokumen, Sertifikat, Kontak, Profil */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          <Navbar
            onOpenNavModal={(navType) => setActiveNavModal(navType)}
          />
        </div>

        {/* Hero Section (Hanya tampil di mode Beranda) */}
        {!isFullGallery && (
          <div style={{ position: 'relative', zIndex: 5 }}>
            <Hero
              onExploreClick={scrollToGallery}
              totalItems={allItems.length}
              onOpenContact={() => setActiveNavModal('kontak')}
            />
          </div>
        )}

        {/* Bar Tombol Kembali jika sedang di Mode Halaman Semua Karya */}
        {isFullGallery && (
          <div style={{ position: 'relative', zIndex: 6, paddingTop: '1.5rem' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleBackToHome}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 800, gap: '0.5rem' }}
              >
                <ArrowLeft size={18} />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        )}

        {/* Category & Subcategory Filter Tabs dengan Search Form */}
        <div id="gallery-section" style={{ position: 'relative', zIndex: 5 }}>
          <CategoryFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSubcategory={activeSubcategory}
            setActiveSubcategory={setActiveSubcategory}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              if (q.trim()) {
                setIsFullGallery(true);
              }
            }}
            itemCount={filteredItems.length}
          />
        </div>

        {/* Portfolio Card Grid */}
        <main style={{ flex: 1, position: 'relative', zIndex: 5 }}>
          <PortfolioGrid
            items={filteredItems}
            loading={loading}
            onItemClick={(item) => setSelectedItem(item)}
            onResetFilter={handleResetFilter}
            isFullGallery={isFullGallery}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              scrollToGallery();
            }}
            onViewMore={handleViewMoreWorks}
          />
        </main>

        {/* Lightbox / Detail Modal (Karya & Sertifikat) */}
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        {/* Modal Informasi Menu Navbar: Profil, Pengalaman Kerja, Dokumen, Sertifikat, Kontak */}
        <InfoModal
          activeType={activeNavModal}
          onClose={() => setActiveNavModal(null)}
          onSelectCertificate={(cert) => setSelectedItem(cert)}
        />

        {/* Admin Dashboard (Akses Rahasia via URL #admin) - Selalu menerima seluruh data karya (allItems) */}
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={handleCloseAdmin}
          items={allItems}
          onCreateItem={handleCreateItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onResetMock={handleResetMock}
        />

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          <Footer
            onCategoryClick={(catId) => {
              setActiveCategory(catId);
              setActiveSubcategory('all');
              setIsFullGallery(true);
              scrollToGallery();
            }}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        </div>
      </div>
    </LanguageProvider>
  );
}
