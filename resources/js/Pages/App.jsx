import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import CategoryFilter from '../Components/CategoryFilter';
import PortfolioGrid from '../Components/PortfolioGrid';
import DetailModal from '../Components/DetailModal';
import AdminDashboard from '../Components/AdminDashboard';
import InfoModal from '../Components/InfoModal';
import Footer from '../Components/Footer';
import MaintenanceModal from '../Components/MaintenanceModal';
import ContentNoticeModal from '../Components/ContentNoticeModal';
import ClientShowcase from '../Components/ClientShowcase';
import { portfolioService } from '../services/portfolioService';
import { infoService } from '../services/infoService';
import { LanguageProvider } from '../context/LanguageContext';
import { PersonaProvider, usePersona } from '../context/PersonaContext';
import { ArrowLeft } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { useScrollReveal } from '../utils/useScrollReveal';

function AppContent({ karyaId, docId }) {
  const { persona } = usePersona();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [allItems, setAllItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeNavModal, setActiveNavModal] = useState(null); // 'profil' | 'pengalaman' | 'dokumen' | 'sertifikat' | 'kontak' | null

  // Halaman Daftar Karya vs Beranda
  const [isFullGallery, setIsFullGallery] = useState(false);
  const [isExpandedBeranda, setIsExpandedBeranda] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Admin Auth & Maintenance Mode State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portoda_admin_authenticated') === 'true';
    }
    return false;
  });

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portoda_maintenance_mode') === 'true';
    }
    return false;
  });

  // Content notice: muncul setiap buka/refresh jika diaktifkan
  const [isContentNoticeEnabled, setIsContentNoticeEnabled] = useState(false);
  const [isContentNoticeOpen, setIsContentNoticeOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      if (typeof window !== 'undefined') {
        setIsAdminAuthenticated(localStorage.getItem('portoda_admin_authenticated') === 'true');
      }
    };
    window.addEventListener('portoda_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('portoda_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const p = await infoService.getProfile();
        const activeMaint = p?.maintenance_mode === true || p?.maintenance_mode === 1 || p?.maintenance_mode === '1';
        setIsMaintenanceMode(activeMaint);

        // Content notice: jika diaktifkan, tampilkan setiap buka/refresh
        const activeNotice = p?.content_notice_enabled !== false && p?.content_notice_enabled !== 0 && p?.content_notice_enabled !== '0';
        setIsContentNoticeEnabled(activeNotice);
        if (activeNotice) {
          setIsContentNoticeOpen(true);
        }
      } catch (err) {
        console.error('Failed to check maintenance mode status:', err);
      }
    };
    checkMaintenance();

    const handleInfoUpdated = () => {
      if (typeof window !== 'undefined') {
        const isMaint = localStorage.getItem('portoda_maintenance_mode') === 'true';
        setIsMaintenanceMode(isMaint);

        const isNotice = localStorage.getItem('portoda_content_notice_enabled') === 'true';
        setIsContentNoticeEnabled(isNotice);
      }
    };

    window.addEventListener('portoda_info_updated', handleInfoUpdated);
    return () => window.removeEventListener('portoda_info_updated', handleInfoUpdated);
  }, []);

  // Tracking statistik pengunjung (Page Views)
  useEffect(() => {
    if (!isAdminAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      let targetKaryaId = selectedItem?.id || karyaId || urlParams.get('karya');
      if (!targetKaryaId && window.location.pathname.startsWith('/karya/')) {
        targetKaryaId = window.location.pathname.split('/karya/')[1];
      }
      infoService.trackPageView({ karya_id: targetKaryaId });
    }
  }, [selectedItem]);

  // Auto-open Detail Modal jika mengakses link karya (misal ?karya=xxx atau /karya/xxx)
  useEffect(() => {
    if (!allItems || allItems.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    let targetId = karyaId || urlParams.get('karya');

    if (!targetId && window.location.pathname.startsWith('/karya/')) {
      targetId = window.location.pathname.split('/karya/')[1];
    }

    if (targetId) {
      const found = allItems.find(i => String(i.id) === String(targetId));
      if (found) {
        setSelectedItem(found);
      }
    }
  }, [allItems, karyaId]);

  const handleCloseDetailModal = () => {
    setSelectedItem(null);
    if (window.location.search.includes('karya=') || window.location.pathname.startsWith('/karya/')) {
      const cleanPath = window.location.pathname.startsWith('/karya/') ? '/' : window.location.pathname;
      window.history.pushState("", document.title, cleanPath);
    }
  };

  // Auto-open Document Modal if ?doc=... or ?document=... is accessed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const targetDocId = docId || urlParams.get('doc') || urlParams.get('document');
      if (targetDocId) {
        setActiveNavModal('dokumen');
      }
    }
  }, [docId]);

  // In-memory instant filtering with Persona support
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Filter by Active Persona (MGD vs DPD)
    if (persona === 'mgd') {
      result = result.filter(i => i.persona === 'mgd' || (!i.persona && (i.category === 'desain-grafis' || i.category === 'multimedia')));
    } else if (persona === 'dpd') {
      result = result.filter(i => i.persona === 'dpd' || (!i.persona && i.category === 'aplikasi'));
    }

    if (activeCategory !== 'all') {
      result = result.filter(i => i.category === activeCategory);
    }

    if (activeSubcategory !== 'all') {
      const reqSub = activeSubcategory.toLowerCase().trim();
      result = result.filter(item => {
        const itemSub = (item.subcategory || '').toLowerCase().trim();
        const itemSubEn = (item.subcategory_en || '').toLowerCase().trim();

        if (item.subcategory === activeSubcategory || itemSub === reqSub || itemSubEn === reqSub) {
          return true;
        }

        if ((reqSub.includes('logo')) && (itemSub.includes('logo') || itemSubEn.includes('logo'))) return true;
        if ((reqSub.includes('poster')) && (itemSub.includes('poster') || itemSubEn.includes('poster'))) return true;
        if ((reqSub.includes('banner')) && (itemSub.includes('banner') || itemSubEn.includes('banner'))) return true;
        if ((reqSub.includes('kemasan') || reqSub.includes('packag')) && (itemSub.includes('kemasan') || itemSubEn.includes('packag'))) return true;
        if ((reqSub.includes('lain') || reqSub.includes('other')) && (itemSub.includes('lain') || itemSubEn.includes('other'))) return true;
        if ((reqSub.includes('foto') || reqSub.includes('photo')) && (itemSub.includes('foto') || itemSubEn.includes('photo'))) return true;
        if ((reqSub.includes('video') || reqSub.includes('videogr')) && (itemSub.includes('video') || itemSubEn.includes('video'))) return true;
        if ((reqSub.includes('motion')) && (itemSub.includes('motion') || itemSubEn.includes('motion'))) return true;
        if ((reqSub.includes('film')) && (itemSub.includes('film') || itemSubEn.includes('film'))) return true;
        if ((reqSub.includes('ui') || reqSub.includes('ux')) && (itemSub.includes('ui') || itemSubEn.includes('ui'))) return true;
        if ((reqSub.includes('mobile')) && (itemSub.includes('mobile') || itemSubEn.includes('mobile'))) return true;
        if ((reqSub.includes('web')) && (itemSub.includes('web') || itemSubEn.includes('web'))) return true;

        return itemSub.includes(reqSub) || reqSub.includes(itemSub);
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
        const category = (item.category || '').toLowerCase();
        const categoryEn = (item.category_en || '').toLowerCase();
        const tools = (item.tools_used || '').toLowerCase();
        const method = (item.development_method || '').toLowerCase();
        const tagsStr = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';

        return title.includes(q) ||
               titleEn.includes(q) ||
               desc.includes(q) ||
               descEn.includes(q) ||
               subcat.includes(q) ||
               subcatEn.includes(q) ||
               category.includes(q) ||
               categoryEn.includes(q) ||
               tools.includes(q) ||
               method.includes(q) ||
               tagsStr.includes(q);
      });
    }

    return result;
  }, [allItems, persona, activeCategory, activeSubcategory, searchQuery]);

  useScrollReveal([filteredItems, activeCategory, activeSubcategory, searchQuery, loading, isFullGallery, currentPage, isExpandedBeranda, clients, persona]);

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
    window.addEventListener('portoda_auth_changed', checkAdminUrl);
    return () => {
      window.removeEventListener('hashchange', checkAdminUrl);
      window.removeEventListener('portoda_auth_changed', checkAdminUrl);
    };
  }, []);

  const handleOpenAdminModal = () => {
    setIsAdminOpen(true);
    if (window.location.hash !== '#admin') {
      window.location.hash = 'admin';
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

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

  const loadClientData = async () => {
    try {
      const clts = await infoService.getClients();
      setClients(clts || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
    }
  };

  useEffect(() => {
    loadPortfolioData();
    loadClientData();

    const handleInfoUpdated = () => {
      loadClientData();
    };
    window.addEventListener('portoda_info_updated', handleInfoUpdated);
    return () => window.removeEventListener('portoda_info_updated', handleInfoUpdated);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setIsExpandedBeranda(false);
  }, [activeCategory, activeSubcategory, searchQuery, persona]);

  const handleCreateItem = async (newItemData, onProgress = null) => {
    await portfolioService.createItem(newItemData, onProgress);
    await loadPortfolioData();
  };

  const handleUpdateItem = async (id, updatedFields, onProgress = null) => {
    await portfolioService.updateItem(id, updatedFields, onProgress);
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
    setIsExpandedBeranda(false);
  };

  const scrollToGallery = () => {
    const galleryElem = document.getElementById('gallery-section');
    if (galleryElem) {
      galleryElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMoreWorks = () => {
    setIsExpandedBeranda(true);
  };

  const handleBackToHome = () => {
    setIsFullGallery(false);
    setIsExpandedBeranda(false);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllWorks = () => {
    handleCloseDetailModal();
    setIsFullGallery(true);
    setIsExpandedBeranda(true);
    setTimeout(() => {
      scrollToGallery();
    }, 100);
  };

  const isMgd = persona === 'mgd';

  return (
    <div className="app-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden',
      backgroundColor: isMgd ? '#005BAB' : '#FFF3DD',
      transition: 'background-color 0.4s ease'
    }}>

      <div style={{ position: 'relative', zIndex: 5 }}>
        <Navbar
          onOpenNavModal={(navType) => setActiveNavModal(navType)}
        />
      </div>

      {!isFullGallery && (
        <div style={{ position: 'relative', zIndex: 5 }}>
          <Hero
            onExploreClick={scrollToGallery}
            totalItems={filteredItems.length}
            onOpenContact={() => setActiveNavModal('kontak')}
          />
        </div>
      )}

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

      <main style={{ flex: 1, position: 'relative', zIndex: 5 }}>
        <PortfolioGrid
          items={filteredItems}
          loading={loading}
          onItemClick={(item) => setSelectedItem(item)}
          onResetFilter={handleResetFilter}
          isFullGallery={isFullGallery}
          isExpanded={isExpandedBeranda}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            scrollToGallery();
          }}
          onViewMore={handleViewMoreWorks}
        />

        <ClientShowcase clients={clients} />
      </main>

      <InfoModal
        activeType={activeNavModal}
        onClose={() => setActiveNavModal(null)}
        onSelectCertificate={(cert) => setSelectedItem(cert)}
      />

      <DetailModal
        item={selectedItem}
        allItems={allItems}
        onClose={handleCloseDetailModal}
        onSelectWork={(workItem) => setSelectedItem(workItem)}
        onViewAllWorks={handleViewAllWorks}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        items={allItems}
        onCreateItem={handleCreateItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onResetMock={handleResetMock}
      />

      <MaintenanceModal
        isOpen={isMaintenanceMode && !isAdminAuthenticated && !isAdminOpen}
      />

      <ContentNoticeModal
        isOpen={isContentNoticeOpen && !isMaintenanceMode && !isAdminAuthenticated && !isAdminOpen}
        onClose={() => setIsContentNoticeOpen(false)}
      />

      <div style={{ position: 'relative', zIndex: 5 }}>
        <Footer
          onCategoryClick={(catId) => {
            setActiveCategory(catId);
            setActiveSubcategory('all');
            setIsFullGallery(true);
            scrollToGallery();
          }}
          onOpenAdmin={handleOpenAdminModal}
          isLoggedIn={isAdminAuthenticated}
        />
      </div>
    </div>
  );
}

export default function App(props) {
  return (
    <LanguageProvider>
      <PersonaProvider>
        <Head title="Portoda - Aplikasi Portofolio Karya Hamdani" />
        <AppContent {...props} />
      </PersonaProvider>
    </LanguageProvider>
  );
}
