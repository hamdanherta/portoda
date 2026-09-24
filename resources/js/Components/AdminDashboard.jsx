import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Edit, Trash2, ShieldCheck, RefreshCw, Check, Upload, LogOut, AlertTriangle, Loader2, Briefcase, FileText, Mail, User, Grid, Award, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Search, SearchX, Palette, Video, Code, BarChart3, PlusCircle, FolderKanban, Globe, Building2, Image, Play, Link, CheckCircle2, Star, Info, Phone, Share2, Bell } from 'lucide-react';
import { compressImageToWebP } from '../utils/imageCompressor';
import { infoService } from '../services/infoService';
import { portfolioService } from '../services/portfolioService';

function EmptyStateCard({
  icon: Icon = SearchX,
  title = "Tidak Ada Karya Ditemukan",
  description = "Coba ubah kata kunci pencarian atau pilih kategori lain.",
  actionLabel,
  onAction,
  actionIcon: ActionIcon = RefreshCw
}) {
  return (
    <div style={{ width: '100%', padding: '2rem 1rem', textAlign: 'center', gridColumn: '1 / -1' }}>
      <div
        className="herta-card"
        style={{
          maxWidth: '460px',
          margin: '0 auto',
          padding: '2.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '2.5px solid #005BAB'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '999px',
          background: '#FFF3DD',
          color: '#005BAB',
          border: '2.5px solid #005BAB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.4rem' }}>{title}</h3>
          <p style={{ color: '#005BAB', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            {description}
          </p>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="btn-primary"
            style={{
              marginTop: '0.25rem',
              padding: '0.65rem 1.35rem',
              borderRadius: '999px',
              fontSize: '0.88rem',
              gap: '0.45rem'
            }}
          >
            {ActionIcon && <ActionIcon size={16} />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard({ isOpen, onClose, items, onCreateItem, onUpdateItem, onDeleteItem, onResetMock }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portoda_admin_authenticated') === 'true';
    }
    return false;
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  useEffect(() => {
    const handleAuthChange = () => {
      if (typeof window !== 'undefined') {
        const isAuthed = localStorage.getItem('portoda_admin_authenticated') === 'true';
        setIsAuthenticated(isAuthed);
      }
    };
    window.addEventListener('portoda_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('portoda_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Internal Full Karya Data State (Memastikan Dashboard selalu menampilkan 100% semua karya tanpa terpengaruh filter beranda)
  const [karyaData, setKaryaData] = useState(() => (Array.isArray(items) && items.length > 0 ? items : []));

  const refreshKaryaData = async () => {
    try {
      const all = await portfolioService.getItems();
      if (Array.isArray(all)) {
        setKaryaData(all);
      }
    } catch (err) {
      console.error('Failed to load full karya list in AdminDashboard:', err);
    }
  };

  useEffect(() => {
    if (Array.isArray(items) && items.length > 0) {
      setKaryaData(items);
    }
  }, [items]);

  useEffect(() => {
    if (isOpen) {
      refreshKaryaData();
    }
  }, [isOpen]);

  // Search Query State for Dashboard
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Category & Subcategory Filter for Dashboard (100% Mandiri)
  const [adminKaryaCategory, setAdminKaryaCategory] = useState('all');
  const [adminKaryaSubcategory, setAdminKaryaSubcategory] = useState('all');

  // Active Tab state: 'overview' | 'tambah-karya' | 'kelola-karya' | 'pengalaman' | 'dokumen' | 'kontak' | 'profil'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileAdminNavOpen, setMobileAdminNavOpen] = useState(false);

  // Loading Modal state, status & upload progress
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingStatus, setProcessingStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [processingProgress, setProcessingProgress] = useState(0); // 0-100%

  // Delete Confirmation Modal state: { id, title, targetType: 'karya'|'exp'|'doc'|'contact' }
  const [deletingTarget, setDeletingTarget] = useState(null);

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const startProcessing = (message, initialProgress = 5) => {
    setFormSuccess('');
    setFormError('');
    setProcessingStatus('loading');
    setProcessingMessage(message);
    setProcessingProgress(initialProgress);
    setIsProcessing(true);
  };

  const finishProcessingSuccess = (successMsg) => {
    setProcessingProgress(100);
    setProcessingStatus('success');
    setProcessingMessage(successMsg);
    setFormSuccess(successMsg);
    setFormError('');
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStatus('loading');
      setProcessingProgress(0);
    }, 1400);
    setTimeout(() => {
      setFormSuccess('');
    }, 4500);
  };

  const finishProcessingError = (errorMsg) => {
    setProcessingStatus('error');
    setProcessingMessage(errorMsg);
    setFormError(errorMsg);
    setFormSuccess('');
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStatus('loading');
      setProcessingProgress(0);
    }, 1800);
    setTimeout(() => {
      setFormError('');
    }, 5000);
  };

  // --- PAGINATION STATES (Maksimal 20 item per halaman) ---
  const ITEMS_PER_PAGE = 20;
  const [karyaPage, setKaryaPage] = useState(1);
  const [expPage, setExpPage] = useState(1);
  const [docPage, setDocPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);

  // --- KARYA FORM STATE ---
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'desain-grafis',
    subcategory: 'Desain Logo',
    description: '',
    image_url: '',
    images: [],
    video_url: '',
    role: '',
    client: '',
    year: new Date().getFullYear().toString(),
    project_type: 'Freelance',
    tools_used: '',
    development_method: 'AIAD',
    framework: '',
    platform: 'Website',
    tags: '',
    project_url: '',
    featured: false
  });

  // --- PENGALAMAN FORM STATE ---
  const [experiences, setExperiences] = useState([]);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expForm, setExpForm] = useState({ title: '', experience_type: 'Kerja', employment_type: 'Full Time', company: '', period: '', description: '', media: [] });

  // --- DOKUMEN FORM STATE ---
  const [documents, setDocuments] = useState([]);
  const [editingDocId, setEditingDocId] = useState(null);
  const [docForm, setDocForm] = useState({ title: '', type: '', category: 'CV ATS', description: '', fileUrl: '', fileName: '' });

  // --- KONTAK FORM STATE ---
  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [contactForm, setContactForm] = useState({ title: '', value: '', url: '', type: 'whatsapp', subtext: '' });

  // --- SERTIFIKAT FORM STATE ---
  const [certificates, setCertificates] = useState([]);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({ title: '', description: '', category: 'Sertifikasi', year: new Date().getFullYear().toString(), institution: '', cover: '', gallery: ['', '', ''] });
  const [certPage, setCertPage] = useState(1);

  // --- PROFIL FORM STATE ---
  const [profile, setProfile] = useState({});
  const [profileForm, setProfileForm] = useState({ name: '', tagline: '', tagline_en: '', bio: '', bio_en: '', skills: [] });
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState({ title: '', title_en: '', desc: '', desc_en: '', category: 'Soft Skill' });

  // --- KLIEN FORM STATE ---
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [clientForm, setClientForm] = useState({ name: '', logo: '' });
  const [clientPage, setClientPage] = useState(1);

  // Load Info Data when authenticated
  const loadInfoData = async () => {
    const [exps, docs, cnts, certs, p, clts] = await Promise.all([
      infoService.getExperiences(),
      infoService.getDocuments(),
      infoService.getContacts(),
      infoService.getCertificates(),
      infoService.getProfile(),
      infoService.getClients()
    ]);
    setExperiences(exps || []);
    setDocuments(docs || []);
    setContacts(cnts || []);
    setCertificates(certs || []);
    setProfile(p || {});
    setProfileForm(p || {});
    setClients(clts || []);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('admin-open');
    } else {
      document.body.classList.remove('admin-open');
    }
    return () => {
      document.body.classList.remove('admin-open');
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadInfoData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcodeInput.trim() === 'danidani') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('portoda_admin_authenticated', 'true');
        window.dispatchEvent(new Event('portoda_auth_changed'));
      }
      setPasscodeError('');
      loadInfoData();
    } else {
      setPasscodeError('Kata sandi salah');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portoda_admin_authenticated', 'false');
      window.dispatchEvent(new Event('portoda_auth_changed'));
    }
    setPasscodeInput('');
    setPasscodeError('');
    resetAllForms();
  };

  const resetAllForms = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'desain-grafis',
      subcategory: 'Desain Logo',
      description: '',
      cover_image: '',
      gallery_images: [],
      image_url: '',
      images: [],
      video_url: '',
      prototype_url: '',
      client: '',
      year: new Date().getFullYear().toString(),
      project_type: 'Freelance',
      tools_used: '',
      development_method: 'AIAD',
      tags: '',
      featured: false
    });
    setEditingExpId(null);
    setExpForm({ title: '', company: '', period: '', description: '', media: [] });
    setEditingDocId(null);
    setDocForm({ title: '', type: '', description: '', fileUrl: '', fileName: '' });
    setEditingContactId(null);
    setContactForm({ title: '', value: '', url: '', type: 'whatsapp', subtext: '' });
    setEditingSkillId(null);
    setSkillForm({ title: '', title_en: '', desc: '', desc_en: '' });
  };

  // --- KARYA HANDLERS ---
  const handleCoverImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startProcessing('Mengompresi Foto Cover (Sampul)...');

    try {
      const webpDataUrl = await compressImageToWebP(file, 0.82, 1200);
      setFormData(prev => ({
        ...prev,
        cover_image: webpDataUrl,
        image_url: webpDataUrl
      }));
      finishProcessingSuccess('Foto cover berhasil dikompresi!');
    } catch (err) {
      finishProcessingError('Gagal mengompres foto cover. Pastikan berkas berupa file foto valid.');
      console.error(err);
    }
  };

  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const rules = getSubcategoryRules(formData.subcategory);
    const currentGallery = formData.gallery_images || [];
    const remainingSlots = rules.maxGallery - currentGallery.length;

    if (remainingSlots <= 0) {
      finishProcessingError(`Foto galeri untuk subkategori "${formData.subcategory}" sudah mencapai batas maksimal (${rules.maxGallery} foto)!`);
      e.target.value = '';
      return;
    }

    if (files.length > remainingSlots) {
      finishProcessingError(`Gagal mengunggah! Subkategori "${formData.subcategory}" hanya mengizinkan maksimal ${rules.maxGallery} foto galeri (tersisa ${remainingSlots} slot foto lagi). Anda memilih ${files.length} foto. Silakan pilih maksimal ${remainingSlots} foto.`);
      e.target.value = '';
      return;
    }

    startProcessing(`Mengompres ${files.length} foto galeri...`);

    try {
      const compressedWebPArray = [];
      for (const file of files) {
        const webpDataUrl = await compressImageToWebP(file, 0.82, 1200);
        compressedWebPArray.push(webpDataUrl);
      }

      setFormData(prev => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), ...compressedWebPArray]
      }));
      finishProcessingSuccess(`${files.length} Foto galeri berhasil dikompresi!`);
    } catch (err) {
      finishProcessingError('Gagal mengompres gambar galeri. Pastikan berkas berupa file foto valid.');
      console.error(err);
    } finally {
      e.target.value = '';
    }
  };

  const removeCoverImage = () => {
    setFormData(prev => ({
      ...prev,
      cover_image: '',
      image_url: ''
    }));
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: (prev.gallery_images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleEditKaryaClick = (item) => {
    const existingImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : (item.image_url ? [item.image_url] : []);

    const cover = item.cover_image || existingImages[0] || item.image_url || '';
    const gallery = Array.isArray(item.gallery_images)
      ? item.gallery_images
      : (existingImages.length > 1 ? existingImages.slice(1) : []);

    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      category: item.category || 'desain-grafis',
      subcategory: item.subcategory || 'Desain Logo',
      description: item.description || '',
      cover_image: cover,
      gallery_images: gallery,
      image_url: cover,
      images: [cover, ...gallery].filter(Boolean),
      video_url: item.video_url || '',
      role: item.role || '',
      prototype_url: item.prototype_url || item.project_url || '',
      client: item.client || '',
      year: item.year || new Date().getFullYear().toString(),
      project_type: item.project_type || 'Freelance',
      tools_used: item.tools_used || '',
      development_method: item.development_method || 'AIAD',
      framework: item.framework || '',
      platform: item.platform || 'Website',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      featured: !!item.featured
    });
    setFormSuccess('');
    setActiveTab('tambah-karya');
  };

  const handleSubmitKarya = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      finishProcessingError('Judul Karya wajib diisi!');
      return;
    }

    const rules = getSubcategoryRules(formData.subcategory);

    if (rules.requireCover && !formData.cover_image) {
      finishProcessingError(`Unggah Foto Cover / Sampul Utama terlebih dahulu untuk subkategori "${formData.subcategory}"!`);
      return;
    }

    if (rules.hasPrototype && rules.requirePrototype) {
      if (!formData.prototype_url || !formData.prototype_url.trim()) {
        finishProcessingError(`Harap masukkan Link Prototype Figma / Web untuk karya "${formData.subcategory}"!`);
        return;
      }
    }

    if (rules.hasVideo && rules.requireVideo) {
      if (!formData.video_url || !formData.video_url.trim()) {
        finishProcessingError(`Harap masukkan Link Video YouTube untuk karya "${formData.subcategory}"!`);
        return;
      }
    }

    startProcessing(editingId ? 'Menyimpan perubahan karya...' : 'Menambahkan karya baru...');

    const formattedTags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const cover = formData.cover_image;
    const gallery = (formData.gallery_images || []).slice(0, rules.maxGallery);

    const isMobileOrWeb = formData.subcategory === 'Web App' || formData.subcategory === 'Mobile App';
    const isMultimediaFilm = formData.category === 'multimedia' && formData.subcategory === 'Film';

    const payload = {
      ...formData,
      role: isMultimediaFilm ? (formData.role || '') : '',
      image_url: cover,
      cover_image: cover,
      gallery_images: gallery,
      images: [cover, ...gallery],
      video_url: rules.hasVideo ? formData.video_url : '',
      prototype_url: rules.hasPrototype ? formData.prototype_url : '',
      project_url: rules.hasPrototype ? formData.prototype_url : '',
      development_method: isMobileOrWeb ? (formData.development_method || 'AIAD') : '',
      tags: formattedTags
    };

    try {
      if (editingId) {
        await onUpdateItem(editingId, payload, (pct) => setProcessingProgress(pct));
        finishProcessingSuccess('Karya berhasil diperbarui!');
      } else {
        await onCreateItem(payload, (pct) => setProcessingProgress(pct));
        finishProcessingSuccess('Karya baru berhasil ditambahkan!');
      }

      await refreshKaryaData();
      resetAllForms();
      setActiveTab('kelola-karya');
    } catch (err) {
      console.error('Error in handleSubmitKarya:', err);
      finishProcessingError(err.message || 'Terjadi kesalahan saat menyimpan karya.');
    }
  };

  // --- PENGALAMAN HANDLERS ---
  const handleExpMediaChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentMedia = expForm.media || [];
    const remainingSlots = 3 - currentMedia.length;

    if (remainingSlots <= 0) {
      finishProcessingError('Foto pendukung pengalaman sudah mencapai batas maksimal (3 foto)!');
      e.target.value = '';
      return;
    }

    if (files.length > remainingSlots) {
      finishProcessingError(`Gagal mengunggah! Foto pendukung pengalaman hanya mengizinkan maksimal 3 foto (tersisa ${remainingSlots} slot foto lagi). Anda memilih ${files.length} foto. Silakan pilih maksimal ${remainingSlots} foto.`);
      e.target.value = '';
      return;
    }

    startProcessing(`Mengompres ${files.length} foto pendukung pengalaman...`);

    try {
      const compressedArray = [];
      for (const file of files) {
        const webpDataUrl = await compressImageToWebP(file, 0.82, 1200);
        compressedArray.push(webpDataUrl);
      }

      setExpForm(prev => ({
        ...prev,
        media: [...(prev.media || []), ...compressedArray]
      }));
      finishProcessingSuccess(`${files.length} Foto pendukung pengalaman berhasil dikompresi!`);
    } catch (err) {
      finishProcessingError('Gagal mengompres foto pendukung.');
      console.error(err);
    } finally {
      e.target.value = '';
    }
  };

  const removeExpMedia = (indexToRemove) => {
    setExpForm(prev => ({
      ...prev,
      media: (prev.media || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmitExperience = async (e) => {
    e.preventDefault();
    if (!expForm.title || !expForm.company || !expForm.period) {
      finishProcessingError('Judul Posisi, Perusahaan, dan Periode wajib diisi!');
      return;
    }

    startProcessing(editingExpId ? 'Menyimpan perubahan pengalaman...' : 'Menambahkan pengalaman baru...', 10);

    try {
      const updatedList = await infoService.saveExperience({
        id: editingExpId,
        ...expForm
      }, (pct) => setProcessingProgress(pct));
      setExperiences(updatedList);
      const successMsg = editingExpId ? 'Pengalaman berhasil diperbarui!' : 'Pengalaman baru berhasil ditambahkan!';
      setEditingExpId(null);
      setExpForm({ title: '', experience_type: 'Kerja', employment_type: 'Full Time', company: '', period: '', description: '', media: [] });
      finishProcessingSuccess(successMsg);
    } catch (err) {
      finishProcessingError('Gagal menyimpan data pengalaman.');
    }
  };

  // --- DOKUMEN HANDLERS ---
  const handleDocFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setDocForm(prev => ({
      ...prev,
      rawFile: file,
      fileName: file.name
    }));

    setFormSuccess(`File "${file.name}" (${fileSizeMB} MB) berhasil dipilih! Silakan klik Simpan Dokumen.`);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const handleSubmitDocument = async (e) => {
    e.preventDefault();
    if (!docForm.title || !docForm.type) {
      finishProcessingError('Nama Dokumen dan Tipe Dokumen wajib diisi!');
      return;
    }

    startProcessing(editingDocId ? 'Menyimpan perubahan dokumen...' : 'Mengunggah & menyimpan dokumen ke server...', 10);

    try {
      const updatedList = await infoService.saveDocument({
        id: editingDocId,
        ...docForm,
        category: docForm.category || 'CV ATS'
      }, (pct) => setProcessingProgress(pct));
      setDocuments(updatedList);
      const successMsg = editingDocId ? 'Dokumen berhasil diperbarui!' : 'Dokumen baru berhasil ditambahkan!';
      setEditingDocId(null);
      setDocForm({ title: '', type: '', category: 'CV ATS', description: '', fileUrl: '', fileName: '', rawFile: null });
      finishProcessingSuccess(successMsg);
    } catch (err) {
      console.error('Error saving document:', err);
      finishProcessingError(err.message || 'Gagal menyimpan dokumen. Pastikan ukuran berkas sesuai batas server.');
    }
  };

  // --- KONTAK HANDLERS ---
  const handleSubmitContact = async (e) => {
    e.preventDefault();
    if (!contactForm.title || !contactForm.value) {
      finishProcessingError('Nama Platform/Judul dan Detail Kontak wajib diisi!');
      return;
    }

    startProcessing(editingContactId ? 'Menyimpan perubahan kontak...' : 'Menambahkan kontak baru...', 10);

    try {
      const updatedList = await infoService.saveContact({
        id: editingContactId,
        ...contactForm
      }, (pct) => setProcessingProgress(pct));
      setContacts(updatedList);
      const successMsg = editingContactId ? 'Kontak berhasil diperbarui!' : 'Kontak baru berhasil ditambahkan!';
      setEditingContactId(null);
      setContactForm({ title: '', value: '', url: '', type: 'whatsapp', subtext: '' });
      finishProcessingSuccess(successMsg);
    } catch (err) {
      finishProcessingError('Gagal menyimpan kontak.');
    }
  };

  // --- PROFIL HANDLERS ---
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    startProcessing('Menyimpan perubahan profil Hamdani...', 10);

    try {
      const updated = await infoService.saveProfile(profileForm, (pct) => setProcessingProgress(pct));
      setProfile(updated);
      setProfileForm(updated);
      finishProcessingSuccess('Profil Hamdani berhasil diperbarui!');
    } catch (err) {
      finishProcessingError('Gagal menyimpan profil.');
    }
  };

  const handleToggleWatermark = async () => {
    const currentVal = profileForm.watermark_enabled !== false;
    const newVal = !currentVal;
    const updatedForm = { ...profileForm, watermark_enabled: newVal };
    setProfileForm(updatedForm);

    try {
      startProcessing(newVal ? 'Mengaktifkan watermark otomatis saat download gambar...' : 'Menoaktifkan watermark otomatis saat download gambar...');
      const updated = await infoService.saveProfile(updatedForm);
      setProfile(updated || updatedForm);
      setProfileForm(updated || updatedForm);
      finishProcessingSuccess(newVal ? 'Watermark Otomatis Berhasil DIAKTIFKAN!' : 'Watermark Otomatis Berhasil DINONAKTIFKAN!');
    } catch (err) {
      console.error('Failed to toggle watermark:', err);
      finishProcessingError('Gagal memperbarui status watermark.');
      setProfileForm(profileForm);
    }
  };

  const handleToggleMaintenance = async () => {
    const isCurrentlyMaint = profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1';
    const newVal = !isCurrentlyMaint;
    const updatedForm = { ...profileForm, maintenance_mode: newVal };
    setProfileForm(updatedForm);

    try {
      startProcessing(newVal ? 'Mengaktifkan Mode Pemeliharaan (Maintenance)...' : 'Menoaktifkan Mode Pemeliharaan (Maintenance)...');
      const updated = await infoService.saveProfile(updatedForm);
      setProfile(updated || updatedForm);
      setProfileForm(updated || updatedForm);
      finishProcessingSuccess(newVal ? 'Mode Maintenance Berhasil DIAKTIFKAN!' : 'Mode Maintenance Berhasil DINONAKTIFKAN!');
    } catch (err) {
      console.error('Failed to toggle maintenance mode:', err);
      finishProcessingError('Gagal memperbarui status mode maintenance.');
      setProfileForm(profileForm);
    }
  };

  const handleToggleContentNotice = async () => {
    const isCurrentlyNotice = profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0';
    const newVal = !isCurrentlyNotice;
    const updatedForm = { ...profileForm, content_notice_enabled: newVal };
    setProfileForm(updatedForm);

    try {
      startProcessing(newVal ? 'Mengaktifkan Modal Pengisian Konten...' : 'Menonaktifkan Modal Pengisian Konten...');
      const updated = await infoService.saveProfile(updatedForm);
      setProfile(updated || updatedForm);
      setProfileForm(updated || updatedForm);
      finishProcessingSuccess(newVal ? 'Modal Pengisian Konten Berhasil DIAKTIFKAN!' : 'Modal Pengisian Konten Berhasil DINONAKTIFKAN!');
    } catch (err) {
      console.error('Failed to toggle content notice modal:', err);
      finishProcessingError('Gagal memperbarui status modal pengisian konten.');
      setProfileForm(profileForm);
    }
  };

  const handleEditSkillClick = (skill) => {
    setEditingSkillId(skill.id);
    setSkillForm({
      title: skill.title || '',
      title_en: skill.title_en || '',
      desc: skill.desc || '',
      desc_en: skill.desc_en || '',
      category: skill.category || 'Soft Skill'
    });
  };

  const handleSubmitSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.title || !skillForm.title.trim()) {
      finishProcessingError('Nama Bidang keahlian wajib diisi!');
      return;
    }
    if (!skillForm.desc || !skillForm.desc.trim()) {
      finishProcessingError('Deskripsi keahlian wajib diisi!');
      return;
    }

    startProcessing(editingSkillId ? 'Menyimpan perubahan keahlian...' : 'Menambahkan keahlian baru...');

    const currentSkills = Array.isArray(profileForm.skills) ? [...profileForm.skills] : [];
    let updatedSkills;

    if (editingSkillId) {
      updatedSkills = currentSkills.map(s => s.id === editingSkillId ? {
        ...s,
        title: skillForm.title,
        title_en: skillForm.title_en || skillForm.title,
        desc: skillForm.desc,
        desc_en: skillForm.desc_en || skillForm.desc,
        category: skillForm.category || 'Soft Skill'
      } : s);
    } else {
      updatedSkills = [
        ...currentSkills,
        {
          id: 'skill-' + Date.now(),
          title: skillForm.title,
          title_en: skillForm.title_en || skillForm.title,
          desc: skillForm.desc,
          desc_en: skillForm.desc_en || skillForm.desc,
          category: skillForm.category || 'Soft Skill'
        }
      ];
    }

    const newProfileData = {
      ...profileForm,
      skills: updatedSkills
    };

    try {
      const updated = await infoService.saveProfile(newProfileData);
      setProfile(updated);
      setProfileForm(updated);
      setEditingSkillId(null);
      setSkillForm({ title: '', title_en: '', desc: '', desc_en: '', category: 'Soft Skill' });
      finishProcessingSuccess(editingSkillId ? 'Keahlian berhasil diperbarui!' : 'Keahlian baru berhasil ditambahkan!');
    } catch (err) {
      finishProcessingError('Gagal menyimpan keahlian.');
    }
  };

  const handleReorderEntity = async (entityType, list, index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    if (entityType === 'skills') {
      const newProfileData = {
        ...profileForm,
        skills: newList,
      };
      setProfileForm(newProfileData);
      try {
        const updated = await infoService.saveProfile(newProfileData);
        setProfile(updated || newProfileData);
        setProfileForm(updated || newProfileData);
        finishProcessingSuccess('Urutan posisi keahlian berhasil diperbarui!');
      } catch (err) {
        console.error('Failed to reorder skills:', err);
        finishProcessingError('Gagal mengubah urutan keahlian.');
      }
      return;
    }

    if (entityType === 'experiences') setExperiences(newList);
    if (entityType === 'documents') setDocuments(newList);
    if (entityType === 'certificates') setCertificates(newList);
    if (entityType === 'contacts') setContacts(newList);

    try {
      const itemsPayload = newList.map(item => item.id);
      if (entityType === 'experiences') await infoService.reorderExperiences(itemsPayload);
      if (entityType === 'documents') await infoService.reorderDocuments(itemsPayload);
      if (entityType === 'certificates') await infoService.reorderCertificates(itemsPayload);
      if (entityType === 'contacts') await infoService.reorderContacts(itemsPayload);
      finishProcessingSuccess('Urutan posisi berhasil diperbarui!');
    } catch (err) {
      console.error(`Failed to reorder ${entityType}:`, err);
      finishProcessingError('Gagal mengubah urutan posisi.');
    }
  };

  // --- SERTIFIKAT HANDLERS ---
  const handleSubmitCertificate = async (e) => {
    e.preventDefault();
    if (!certForm.title || !certForm.category || !certForm.institution) {
      finishProcessingError('Nama Sertifikat, Kategori, dan Institusi wajib diisi!');
      return;
    }

    startProcessing(editingCertId ? 'Menyimpan perubahan sertifikat...' : 'Menambahkan sertifikat baru...', 10);

    try {
      const updatedList = await infoService.saveCertificate({
        id: editingCertId,
        ...certForm,
        gallery: (certForm.gallery || []).filter(Boolean)
      }, (pct) => setProcessingProgress(pct));
      setCertificates(updatedList);
      const successMsg = editingCertId ? 'Sertifikat berhasil diperbarui!' : 'Sertifikat baru berhasil ditambahkan!';
      setEditingCertId(null);
      setCertForm({ title: '', description: '', category: 'Sertifikasi', year: new Date().getFullYear().toString(), institution: '', cover: '', gallery: [] });
      finishProcessingSuccess(successMsg);
    } catch (err) {
      finishProcessingError('Gagal menyimpan sertifikat.');
    }
  };

  const handleCertCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startProcessing('Mengompresi Foto Sampul Sertifikat...');

    try {
      const webpDataUrl = await compressImageToWebP(file, 0.82, 1200);
      setCertForm(prev => ({
        ...prev,
        cover: webpDataUrl
      }));
      finishProcessingSuccess('Foto sampul sertifikat berhasil dikompresi!');
    } catch (err) {
      finishProcessingError('Gagal mengompres foto sampul sertifikat.');
      console.error(err);
    }
  };

  const removeCertCoverImage = () => {
    setCertForm(prev => ({
      ...prev,
      cover: ''
    }));
  };

  const handleCertGalleryChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentGallery = (certForm.gallery || []).filter(Boolean);
    const remainingSlots = 3 - currentGallery.length;

    if (remainingSlots <= 0) {
      finishProcessingError('Foto galeri sertifikat sudah mencapai batas maksimal (3 foto)!');
      e.target.value = '';
      return;
    }

    if (files.length > remainingSlots) {
      finishProcessingError(`Gagal mengunggah! Foto galeri sertifikat hanya mengizinkan maksimal 3 foto (tersisa ${remainingSlots} slot foto lagi). Anda memilih ${files.length} foto. Silakan pilih maksimal ${remainingSlots} foto.`);
      e.target.value = '';
      return;
    }

    startProcessing(`Mengompres ${files.length} foto galeri sertifikat...`);

    try {
      const compressedWebPArray = [];
      for (const file of files) {
        const webpDataUrl = await compressImageToWebP(file, 0.82, 1200);
        compressedWebPArray.push(webpDataUrl);
      }

      setCertForm(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []).filter(Boolean), ...compressedWebPArray]
      }));
      finishProcessingSuccess(`${files.length} Foto galeri sertifikat berhasil dikompresi!`);
    } catch (err) {
      finishProcessingError('Gagal mengompres foto galeri sertifikat.');
      console.error(err);
    } finally {
      e.target.value = '';
    }
  };

  const removeCertGalleryImage = (indexToRemove) => {
    setCertForm(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // --- KLIEN HANDLERS ---
  const handleClientLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startProcessing('Mengompresi Logo Klien (Rasio 1:1)...');

    try {
      const webpDataUrl = await compressImageToWebP(file, 0.88, 600);
      setClientForm(prev => ({
        ...prev,
        logo: webpDataUrl
      }));
      finishProcessingSuccess('Logo klien berhasil dikompresi!');
    } catch (err) {
      finishProcessingError('Gagal mengompres logo klien. Pastikan berkas berupa file foto/gambar valid.');
      console.error(err);
    }
  };

  const handleSubmitClient = async (e) => {
    e.preventDefault();
    if (!clientForm.name && !clientForm.logo) {
      finishProcessingError('Mohon isi nama klien atau unggah logo klien!');
      return;
    }

    startProcessing(editingClientId ? 'Memperbarui Data Klien...' : 'Menambahkan Klien Baru...');

    try {
      const payload = { ...clientForm };
      if (editingClientId) {
        payload.id = editingClientId;
      }

      const updatedList = await infoService.saveClient(payload, (pct) => {
        setProcessingProgress(pct);
      });

      setClients(updatedList || []);
      setEditingClientId(null);
      setClientForm({ name: '', logo: '' });
      finishProcessingSuccess(editingClientId ? 'Data Klien berhasil diperbarui!' : 'Klien Baru berhasil ditambahkan!');
    } catch (err) {
      finishProcessingError('Gagal menyimpan data klien. Silakan coba lagi.');
      console.error(err);
    }
  };

  const handleReorderClient = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === clients.length - 1) return;

    const newClients = [...clients];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newClients[index];
    newClients[index] = newClients[targetIndex];
    newClients[targetIndex] = temp;

    setClients(newClients);

    try {
      const updated = await infoService.reorderClients(newClients);
      setClients(updated || newClients);
    } catch (err) {
      console.error('Failed to reorder clients:', err);
    }
  };

  const handleReorderKaryaItem = async (index, direction) => {
    const list = [...filteredKaryaItems];
    if (list.length === 0) return;
    if ((direction === 'up' || direction === 'top') && index === 0) return;
    if ((direction === 'down' || direction === 'bottom') && index === list.length - 1) return;

    const itemToMove = list[index];

    if (direction === 'top') {
      list.splice(index, 1);
      list.unshift(itemToMove);
    } else if (direction === 'bottom') {
      list.splice(index, 1);
      list.push(itemToMove);
    } else if (direction === 'up') {
      list[index] = list[index - 1];
      list[index - 1] = itemToMove;
    } else if (direction === 'down') {
      list[index] = list[index + 1];
      list[index + 1] = itemToMove;
    }

    startProcessing('Memperbarui urutan posisi karya...');

    try {
      await portfolioService.reorderItems(list);
      if (refreshKaryaData) {
        await refreshKaryaData();
      }
      finishProcessingSuccess('Urutan posisi karya berhasil diperbarui!');
    } catch (err) {
      console.error('Failed to reorder karya items:', err);
      finishProcessingError('Gagal mengubah urutan posisi karya.');
    }
  };

  // --- GENERIC DELETE CONFIRMATION HANDLER ---
  const confirmDeleteTarget = async () => {
    if (!deletingTarget) return;

    const target = deletingTarget;
    const label = target.label;
    const title = target.title;
    const isReset = target.targetType === 'reset-mock';

    // Set null immediately so confirmation box closes and animated loading modal spinner is clearly visible
    setDeletingTarget(null);

    startProcessing(isReset ? 'Mereset & menghapus seluruh data dari database...' : `Menghapus ${label} "${title}"...`);

    try {
      if (target.targetType === 'karya') {
        await onDeleteItem(target.id);
        await refreshKaryaData();
      } else if (target.targetType === 'reset-mock') {
        await onResetMock();
        await refreshKaryaData();
        setExperiences([]);
        setDocuments([]);
        setContacts([]);
        setCertificates([]);
        setClients([]);
        setProfileForm({});
      } else if (target.targetType === 'exp') {
        const updated = await infoService.deleteExperience(target.id);
        setExperiences(updated);
      } else if (target.targetType === 'doc') {
        const updated = await infoService.deleteDocument(target.id);
        setDocuments(updated);
      } else if (target.targetType === 'contact') {
        const updated = await infoService.deleteContact(target.id);
        setContacts(updated);
      } else if (target.targetType === 'certificate') {
        const updated = await infoService.deleteCertificate(target.id);
        setCertificates(updated);
      } else if (target.targetType === 'client') {
        const updated = await infoService.deleteClient(target.id);
        setClients(updated);
      } else if (target.targetType === 'skill') {
        const currentSkills = Array.isArray(profileForm.skills) ? [...profileForm.skills] : [];
        const updatedSkills = currentSkills.filter(s => s.id !== target.id);
        const newProfileData = {
          ...profileForm,
          skills: updatedSkills
        };
        const updated = await infoService.saveProfile(newProfileData);
        setProfile(updated);
        setProfileForm(updated);
      }
      finishProcessingSuccess(isReset ? 'Seluruh data karya, pengalaman, sertifikat, dan informasi berhasil dihapus dari database!' : `Data ${label} "${title}" berhasil dihapus!`);
    } catch (err) {
      finishProcessingError('Gagal menghapus data.');
    }
  };

  const getSubcategoriesByCategory = (cat) => {
    switch (cat) {
      case 'desain-grafis':
        return ['Desain Logo', 'Desain Banner', 'Desain Poster', 'Desain Kemasan', 'Desain Lainnya'];
      case 'multimedia':
        return ['Fotografi', 'Videografi', 'Motion Graphic', 'Film'];
      case 'aplikasi':
        return ['UI/UX', 'Mobile App', 'Web App'];
      default:
        return ['Desain Logo'];
    }
  };

  const getSubcategoryRules = (subcat) => {
    const s = (subcat || '').toLowerCase().trim();

    if (s.includes('lomba') || s.includes('contest') || s.includes('competition')) {
      return { maxCover: 1, maxGallery: 5, hasVideo: true, hasPrototype: true };
    }

    // DESAIN GRAFIS
    if (s.includes('logo')) return { maxCover: 1, maxGallery: 5, hasVideo: false, hasPrototype: false };
    if (s.includes('banner')) return { maxCover: 1, maxGallery: 1, hasVideo: false, hasPrototype: false };
    if (s.includes('poster')) return { maxCover: 1, maxGallery: 1, hasVideo: false, hasPrototype: false };
    if (s.includes('kemasan') || s.includes('packaging')) return { maxCover: 1, maxGallery: 3, hasVideo: false, hasPrototype: false };
    if (s.includes('lain')) return { maxCover: 1, maxGallery: 1, hasVideo: false, hasPrototype: false };

    // MULTIMEDIA
    if (s.includes('foto') || s.includes('photo')) return { maxCover: 1, maxGallery: 3, hasVideo: false, hasPrototype: false };
    if (s.includes('video') || s.includes('videografi')) return { maxCover: 1, maxGallery: 0, hasVideo: true, hasPrototype: false };
    if (s.includes('motion')) return { maxCover: 1, maxGallery: 0, hasVideo: true, hasPrototype: false };
    if (s.includes('film') || s.includes('movie')) return { maxCover: 1, maxGallery: 0, hasVideo: true, hasPrototype: false };

    // APLIKASI
    if (s.includes('ui') || s.includes('ux')) {
      return {
        maxCover: 1,
        maxGallery: 3,
        hasVideo: false,
        hasPrototype: true,
        prototypeLabel: 'Link Coba Prototype (Figma / Prototype)',
        buttonText: 'Coba Prototype'
      };
    }
    if (s.includes('mobile') || s.includes('seluler') || s.includes('hp')) {
      return {
        maxCover: 1,
        maxGallery: 3,
        hasVideo: false,
        hasPrototype: true,
        prototypeLabel: 'Link Coba Aplikasi (PlayStore / App Store / Demo)',
        buttonText: 'Coba Aplikasi'
      };
    }
    if (s.includes('web')) {
      return {
        maxCover: 1,
        maxGallery: 3,
        hasVideo: false,
        hasPrototype: true,
        prototypeLabel: 'Link Coba Aplikasi (Web URL)',
        buttonText: 'Coba Aplikasi'
      };
    }

    if (formData.category === 'aplikasi') {
      return {
        maxCover: 1,
        maxGallery: 3,
        hasVideo: false,
        hasPrototype: true,
        prototypeLabel: 'Link Coba Aplikasi (PlayStore / App Store / Web / Demo)',
        buttonText: 'Coba Aplikasi'
      };
    }

    return { maxCover: 1, maxGallery: 3, hasVideo: false, hasPrototype: false };
  };

  // --- REUSABLE PAGINATION BAR COMPONENT ---
  const renderPaginationControls = (currentPage, totalListLength, onPageChange) => {
    const totalPages = Math.ceil(totalListLength / ITEMS_PER_PAGE) || 1;
    if (totalPages <= 1) return null;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '2.5px solid #005BAB',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#005BAB' }}>
          Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> (Total {totalListLength} Data)
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="btn-secondary"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            &laquo; Sebelumnya
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="btn-secondary"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Selanjutnya &raquo;
          </button>
        </div>
      </div>
    );
  };

  const effectiveItems = (karyaData && karyaData.length > 0 ? karyaData : items) || [];

  // Filter Items by Admin Category, Subcategory, and Search Query (100% Mandiri tanpa terpengaruh beranda)
  const filteredKaryaItems = effectiveItems.filter((item) => {
    // 1. Filter Kategori Internal Admin
    if (adminKaryaCategory !== 'all' && item.category !== adminKaryaCategory) {
      return false;
    }
    // 2. Filter Subkategori Internal Admin
    if (adminKaryaSubcategory !== 'all' && item.subcategory !== adminKaryaSubcategory) {
      return false;
    }
    // 3. Pencarian Kata Kunci Admin
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.toLowerCase().trim();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.title_en && item.title_en.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.description_en && item.description_en.toLowerCase().includes(q)) ||
      (item.subcategory && item.subcategory.toLowerCase().includes(q)) ||
      (item.subcategory_en && item.subcategory_en.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.client && item.client.toLowerCase().includes(q)) ||
      (item.year && item.year.toString().includes(q)) ||
      (Array.isArray(item.tags) && item.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  });

  const filteredExpItems = experiences.filter((exp) => {
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.toLowerCase().trim();
    return (
      (exp.title && exp.title.toLowerCase().includes(q)) ||
      (exp.company && exp.company.toLowerCase().includes(q)) ||
      (exp.description && exp.description.toLowerCase().includes(q)) ||
      (exp.period && exp.period.toLowerCase().includes(q))
    );
  });

  const filteredDocItems = documents.filter((doc) => {
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.toLowerCase().trim();
    return (
      (doc.title && doc.title.toLowerCase().includes(q)) ||
      (doc.type && doc.type.toLowerCase().includes(q)) ||
      (doc.description && doc.description.toLowerCase().includes(q))
    );
  });

  const filteredContactItems = contacts.filter((c) => {
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.toLowerCase().trim();
    return (
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.value && c.value.toLowerCase().includes(q)) ||
      (c.subtext && c.subtext.toLowerCase().includes(q))
    );
  });

  const filteredCertItems = certificates.filter((cert) => {
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.toLowerCase().trim();
    return (
      (cert.title && cert.title.toLowerCase().includes(q)) ||
      (cert.category && cert.category.toLowerCase().includes(q)) ||
      (cert.institution && cert.institution.toLowerCase().includes(q)) ||
      (cert.year && cert.year.toString().includes(q)) ||
      (cert.description && cert.description.toLowerCase().includes(q))
    );
  });

  // Slice Current Page Items
  const currentKaryaItems = filteredKaryaItems.slice((karyaPage - 1) * ITEMS_PER_PAGE, karyaPage * ITEMS_PER_PAGE);
  const currentExpItems = filteredExpItems.slice((expPage - 1) * ITEMS_PER_PAGE, expPage * ITEMS_PER_PAGE);
  const currentDocItems = filteredDocItems.slice((docPage - 1) * ITEMS_PER_PAGE, docPage * ITEMS_PER_PAGE);
  const currentContactItems = filteredContactItems.slice((contactPage - 1) * ITEMS_PER_PAGE, contactPage * ITEMS_PER_PAGE);
  const currentCertItems = filteredCertItems.slice((certPage - 1) * ITEMS_PER_PAGE, certPage * ITEMS_PER_PAGE);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#FFF3DD',
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
      className="admin-sidebar-layout animate-fade-in"
    >
      {/* Modal Loading & Success Indicator Overlay dengan Blur Backdrop */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div className="herta-card" style={{
            padding: '2.5rem 2.25rem',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            border: processingStatus === 'success' ? '3px solid #10B981' : processingStatus === 'error' ? '3px solid #EF4444' : '3px solid #005BAB',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            maxWidth: '380px',
            width: '100%',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {processingStatus === 'loading' && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '4px solid #E2E8F0',
                    borderTopColor: '#005BAB',
                    animation: 'spin 0.9s linear infinite'
                  }} />
                  <Loader2 size={28} color="#005BAB" />
                </div>
                <div style={{ width: '100%' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#005BAB', fontWeight: 800, marginBottom: '0.4rem', textAlign: 'center' }}>
                    {processingMessage || 'Memproses Data...'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, textAlign: 'center', margin: 0 }}>
                    Mohon tunggu sebentar, sistem sedang memproses data.
                  </p>
                  
                  {/* Visual Progress Bar */}
                  <div style={{ marginTop: '1.25rem', width: '100%' }}>
                    <div style={{
                      width: '100%',
                      height: '14px',
                      backgroundColor: '#FFF3DD',
                      borderRadius: '999px',
                      border: '2px solid #005BAB',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        width: `${Math.min(100, Math.max(3, Math.round(processingProgress)))}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #005BAB 0%, #0284C7 50%, #10B981 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.25s ease-out',
                        boxShadow: '0 0 10px rgba(0, 91, 171, 0.4)'
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem', fontSize: '0.82rem', color: '#005BAB', fontWeight: 800 }}>
                      <span>Progres Unggah & Memproses:</span>
                      <span style={{ color: '#005BAB', fontSize: '0.9rem', fontWeight: 900 }}>
                        {Math.min(100, Math.max(0, Math.round(processingProgress)))}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {processingStatus === 'success' && (
              <div style={{ animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  border: '3px solid #10B981',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
                  animation: 'bounceScale 0.5s ease'
                }}>
                  <Check size={40} strokeWidth={3.5} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#065F46', fontWeight: 900, marginBottom: '0.35rem' }}>
                  Berhasil!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#15803D', fontWeight: 700 }}>
                  {processingMessage || 'Perubahan berhasil disimpan!'}
                </p>
              </div>
            )}

            {processingStatus === 'error' && (
              <div style={{ animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  border: '3px solid #EF4444',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
                  animation: 'shake 0.4s ease'
                }}>
                  <X size={40} strokeWidth={3.5} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#991B1B', fontWeight: 900, marginBottom: '0.35rem' }}>
                  Gagal!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#B91C1C', fontWeight: 700 }}>
                  {processingMessage || 'Terjadi kesalahan saat memproses.'}
                </p>
              </div>
            )}
          </div>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            @keyframes bounceScale { 0% { transform: scale(0.5); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
            @keyframes slideInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      )}

      {/* Custom Confirmation Modal Hapus Data / Reset Sampel (Untuk Semua Kategori) */}
      {deletingTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="herta-card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '2.25rem 2rem', background: '#FFFFFF', textAlign: 'center', borderRadius: '24px', border: '3px solid #005BAB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.85rem',
              borderRadius: '999px',
              background: '#FFF3DD',
              color: '#005BAB',
              border: '2px solid #005BAB',
              marginBottom: '1rem'
            }}>
              <AlertTriangle size={36} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#005BAB', fontWeight: 800, marginBottom: '0.5rem' }}>
              {deletingTarget.targetType === 'reset-mock' ? 'Konfirmasi Hapus Data' : 'Konfirmasi Hapus Data'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#005BAB', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {deletingTarget.targetType === 'reset-mock'
                ? 'Apakah Anda yakin ingin menghapus semua data?'
                : <>Apakah Anda yakin ingin menghapus {deletingTarget.label} <strong style={{ textDecoration: 'underline' }}>"{deletingTarget.title}"</strong>?</>
              }
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={confirmDeleteTarget}
                className="btn-primary"
                style={{ background: '#005BAB', color: '#FFFFFF', padding: '0.65rem 1.4rem' }}
              >
                <Trash2 size={16} />
                <span>{deletingTarget.targetType === 'reset-mock' ? 'Ya, Hapus Saja' : 'Ya, Hapus Data'}</span>
              </button>
              <button
                onClick={() => setDeletingTarget(null)}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.4rem' }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Protection Screen */}
      {!isAuthenticated ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="herta-card" style={{ maxWidth: '420px', width: '100%', padding: '2rem', background: '#FFFFFF', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={48} color="#005BAB" />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#005BAB', marginBottom: '0.5rem' }}>Autentikasi Admin</h3>
            <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, marginBottom: '1.5rem' }}>
              Masukkan kata sandi<br></br> untuk mengelola seluruh data. <br/>
              {/* <span style={{ background: '#FFF3DD', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1.5px solid #005BAB', marginTop: '0.5rem', display: 'inline-block' }}>
                <b>sipoda123</b>
              </span> */}
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', textAlign: 'center', width: '100%' }}>Kata Sandi</label>
                <input
                  type="password"
                  placeholder="Masukkan sandi..."
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="form-input"
                  style={{ textAlign: 'center' }}
                  autoFocus
                />
              </div>

              {passcodeError && (
                <p style={{ color: '#005BAB', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 700 }}>
                  {passcodeError}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <span>Masuk Dashboard</span>
                </button>
                <button type="button" onClick={onClose} className="btn-secondary">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Standalone Sidebar Dashboard Layout */
        <div style={{ display: 'flex', width: '100%', height: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="admin-app-wrapper modal-no-scrollbar">
          {/* MOBILE HEADER BAR FOR ADMIN DASHBOARD (Screen <= 860px) */}
          <div className="admin-mobile-header" style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.1rem',
            background: '#FFFFFF',
            borderBottom: '2.5px solid #005BAB',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img src="/logoblue.png" alt="Portoda Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#005BAB', margin: 0, lineHeight: 1.1 }}>Portoda Admin</h3>
                <span style={{ fontSize: '0.72rem', color: '#005BAB', fontWeight: 700, opacity: 0.85 }}>
                  {activeTab === 'overview' && 'Ringkasan & Statistik'}
                  {activeTab === 'tambah-karya' && 'Tambah Karya'}
                  {activeTab === 'kelola-karya' && 'Kelola Karya'}
                  {activeTab === 'klien' && 'Kelola Klien'}
                  {activeTab === 'pengalaman' && 'Pengalaman'}
                  {activeTab === 'dokumen' && 'Dokumen'}
                  {activeTab === 'sertifikat' && 'Kelola Sertifikat'}
                  {activeTab === 'kontak' && 'Kelola Kontak'}
                  {activeTab === 'profil' && 'Kelola Profil'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileAdminNavOpen(!mobileAdminNavOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.85rem',
                background: '#005BAB',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: '2px solid #005BAB',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {mobileAdminNavOpen ? <X size={20} /> : <Menu size={20} />}
              <span>Menu</span>
            </button>
          </div>

          {/* MOBILE ADMIN DRAWER MENU */}
          {mobileAdminNavOpen && (
            <div className="admin-mobile-drawer" style={{
              background: '#FFFFFF',
              borderBottom: '2.5px solid #005BAB',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              width: '100%'
            }}>
              {[
                { id: 'overview', label: 'Ringkasan & Statistik', icon: BarChart3 },
                { id: 'tambah-karya', label: 'Tambah Karya Baru', icon: PlusCircle },
                { id: 'kelola-karya', label: 'Kelola & Daftar Karya', icon: FolderKanban },
                { id: 'klien', label: 'Kelola Klien', icon: Building2 },
                { id: 'pengalaman', label: 'Pengalaman', icon: Briefcase },
                { id: 'dokumen', label: 'Dokumen', icon: FileText },
                { id: 'sertifikat', label: 'Kelola Sertifikat', icon: Award },
                { id: 'kontak', label: 'Kelola Kontak', icon: Phone },
                { id: 'profil', label: 'Kelola Profil', icon: User }
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileAdminNavOpen(false);
                      setFormSuccess('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '14px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      textAlign: 'left',
                      color: isActive ? '#FFFFFF' : '#005BAB',
                      background: isActive ? '#005BAB' : '#FFF3DD',
                      border: '2px solid #005BAB',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '2px solid #005BAB' }}>
                <button
                  onClick={onClose}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.55rem', fontSize: '0.82rem' }}
                >
                  <Globe size={16} /> Ke Beranda
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.55rem', fontSize: '0.82rem' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}

          {/* LEFT SIDEBAR NAVIGATION PANEL */}
          <aside style={{
            width: '275px',
            flexShrink: 0,
            background: '#FFFFFF',
            borderRight: '2.5px solid #005BAB',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem 1.25rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }} className="admin-sidebar modal-no-scrollbar">
            <div>
              {/* Sidebar Header / Brand Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '1.75rem',
                paddingBottom: '1.25rem',
                borderBottom: '2.5px solid #005BAB'
              }}>
                <img
                  src="/logoblue.png"
                  alt="Portoda Logo"
                  style={{
                    height: '44px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.1 }}>Portoda</h2>
                  <span style={{ fontSize: '0.74rem', color: '#005BAB', fontWeight: 700, opacity: 0.85, display: 'block', marginTop: '0.15rem' }}>
                    Dashboard
                  </span>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }} className="admin-sidebar-menu">
                {[
                  { id: 'overview', label: 'Ringkasan & Statistik', icon: BarChart3 },
                  { id: 'tambah-karya', label: 'Tambah Karya Baru', icon: PlusCircle },
                  { id: 'kelola-karya', label: 'Kelola Karya', icon: FolderKanban },
                  { id: 'klien', label: 'Kelola Klien', icon: Building2 },
                  { id: 'pengalaman', label: 'Kelola Pengalaman', icon: Briefcase },
                  { id: 'dokumen', label: 'Kelola Dokumen', icon: FileText },
                  { id: 'sertifikat', label: 'Kelola Sertifikat', icon: Award },
                  { id: 'kontak', label: 'Kelola Kontak', icon: Phone },
                  { id: 'profil', label: 'Kelola Profil', icon: User }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setFormSuccess('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.7rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '16px',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        textAlign: 'left',
                        color: isActive ? '#FFFFFF' : '#005BAB',
                        background: isActive ? '#005BAB' : '#FFF3DD',
                        border: '2px solid #005BAB',
                        boxShadow: isActive ? '0 4px 12px rgba(0, 91, 171, 0.2)' : 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      <IconComp size={18} />
                      <span style={{ fontSize: '0.88rem' }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Bottom Action Buttons */}
            <div style={{ paddingTop: '1.25rem', borderTop: '2px solid #005BAB', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.86rem' }}
                title="Kembali ke Halaman Beranda Utama"
              >
                <Globe size={16} />
                <span>Ke Beranda</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.55rem 1rem', fontSize: '0.86rem' }}
                title="Keluar dari Admin Dashboard"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT AREA */}
          <main style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '1.75rem 2.25rem 4rem', background: '#FFF3DD', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="admin-content-main modal-no-scrollbar">
            {/* Top Bar Header Area */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1.15rem',
              borderBottom: '2.5px solid #005BAB',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {activeTab === 'overview' && <><BarChart3 size={24} /> <span>Ringkasan & Statistik</span></>}
                  {activeTab === 'tambah-karya' && <><PlusCircle size={24} /> <span>Form Tambah & Edit Karya Baru</span></>}
                  {activeTab === 'kelola-karya' && <><FolderKanban size={24} /> <span>Panel Pengelolaan & Daftar Karya</span></>}
                  {activeTab === 'klien' && <><Building2 size={24} /> <span>Pengelolaan Daftar Klien Hamdani</span></>}
                  {activeTab === 'pengalaman' && <><Briefcase size={24} /> <span>Pengelolaan Riwayat Pengalaman</span></>}
                  {activeTab === 'dokumen' && <><FileText size={24} /> <span>Pengelolaan Dokumen PDF</span></>}
                  {activeTab === 'sertifikat' && <><Award size={24} /> <span>Pengelolaan Sertifikat & Penghargaan</span></>}
                  {activeTab === 'kontak' && <><Phone size={24} /> <span>Pengelolaan Kontak & Profil Hamdani</span></>}
                  {activeTab === 'profil' && <><User size={24} /> <span>Pengelolaan Biodata & Profil Utama</span></>}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, marginTop: '0.15rem' }}>
                  Halaman Dashboard Manajemen Portofolio Digital Portoda
                </p>
              </div>
            </div>

            {/* GREEN SUCCESS ALERT CARD */}
            {formSuccess && (
              <div style={{
                background: '#ECFDF5',
                color: '#065F46',
                border: '2.5px solid #10B981',
                padding: '0.85rem 1.25rem',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)',
                animation: 'slideInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    background: '#10B981',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.92rem', color: '#065F46' }}>{formSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormSuccess('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#065F46',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.8
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* RED ERROR ALERT CARD */}
            {formError && (
              <div style={{
                background: '#FEF2F2',
                color: '#991B1B',
                border: '2.5px solid #EF4444',
                padding: '0.85rem 1.25rem',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.15)',
                animation: 'slideInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <X size={16} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.92rem', color: '#991B1B' }}>{formError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormError('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#991B1B',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.8
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* TAB 0: RINGKASAN & STATISTIK EXECUTIVE */}
            {activeTab === 'overview' && (
              <div>
                {/* Metric Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem', marginBottom: '1.75rem' }}>
                  {/* Total Karya */}
                  <div className="herta-card" style={{ padding: '1.25rem', background: '#FFFFFF', border: '2.5px solid #005BAB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>Total Karya</span>
                      <div style={{ padding: '0.45rem', borderRadius: '10px', background: '#FFF3DD', color: '#005BAB', border: '1.5px solid #005BAB' }}>
                        <Grid size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.1 }}>{effectiveItems.length}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.25rem' }}>Seluruh Kategori Karya</div>
                  </div>

                  {/* Desain Grafis */}
                  <div className="herta-card" style={{ padding: '1.25rem', background: '#FFFFFF', border: '2.5px solid #005BAB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>Desain Grafis</span>
                      <div style={{ padding: '0.45rem', borderRadius: '10px', background: '#005BAB', color: '#FFFFFF' }}>
                        <Palette size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.1 }}>
                      {effectiveItems.filter(i => i.category === 'desain-grafis').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.25rem' }}>
                      Logo, Banner, Poster, Kemasan
                    </div>
                  </div>

                  {/* Multimedia */}
                  <div className="herta-card" style={{ padding: '1.25rem', background: '#FFFFFF', border: '2.5px solid #005BAB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>Multimedia</span>
                      <div style={{ padding: '0.45rem', borderRadius: '10px', background: '#005BAB', color: '#FFFFFF' }}>
                        <Video size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.1 }}>
                      {effectiveItems.filter(i => i.category === 'multimedia').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.25rem' }}>
                      Fotografi, Video, Motion, Film
                    </div>
                  </div>

                  {/* Aplikasi */}
                  <div className="herta-card" style={{ padding: '1.25rem', background: '#FFFFFF', border: '2.5px solid #005BAB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>Aplikasi</span>
                      <div style={{ padding: '0.45rem', borderRadius: '10px', background: '#005BAB', color: '#FFFFFF' }}>
                        <Code size={18} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.1 }}>
                      {effectiveItems.filter(i => i.category === 'aplikasi').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.25rem' }}>
                      UI/UX, Mobile App, Web App
                    </div>
                  </div>
                </div>

                {/* Additional Metrics & Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  <div className="herta-card" style={{ padding: '1.5rem', background: '#FFF3D', border: '2.5px solid #005BAB' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#005BAB', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={20} />
                      <span>Status & Data Portofolio</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,91,171,0.15)', fontSize: '0.9rem', fontWeight: 700, color: '#005BAB' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Star size={16} color="#005BAB" />
                          <span>Karya Unggulan</span>
                        </span>
                        <span style={{ fontWeight: 800 }}>{effectiveItems.filter(i => i.featured).length} Karya</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,91,171,0.15)', fontSize: '0.9rem', fontWeight: 700, color: '#005BAB' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Briefcase size={16} color="#005BAB" />
                          <span>Pengalaman</span>
                        </span>
                        <span style={{ fontWeight: 800 }}>{experiences.length} Entri</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,91,171,0.15)', fontSize: '0.9rem', fontWeight: 700, color: '#005BAB' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FileText size={16} color="#005BAB" />
                          <span>Dokumen</span>
                        </span>
                        <span style={{ fontWeight: 800 }}>{documents.length} Dokumen</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,91,171,0.15)', fontSize: '0.9rem', fontWeight: 700, color: '#005BAB' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Award size={16} color="#005BAB" />
                          <span>Sertifikat</span>
                        </span>
                        <span style={{ fontWeight: 800 }}>{certificates.length} Sertifikat</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, color: '#005BAB' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={16} color="#005BAB" />
                          <span>Kontak</span>
                        </span>
                        <span style={{ fontWeight: 800 }}>{contacts.length} Kontak</span>
                      </div>
                    </div>
                  </div>

                  {/* Watermark Control Card */}
                  <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '2.5px solid #005BAB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#005BAB', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                          <ShieldCheck size={20} />
                          <span>Watermark Otomatis</span>
                        </h3>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          background: profileForm.watermark_enabled !== false ? '#DCFCE7' : '#FEE2E2',
                          color: profileForm.watermark_enabled !== false ? '#15803D' : '#DC2626',
                          border: `1.5px solid ${profileForm.watermark_enabled !== false ? '#16A34A' : '#DC2626'}`
                        }}>
                          {profileForm.watermark_enabled !== false ? '(ON)' : '(OFF)'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        Kontrol penempelan watermark otomatis pada semua gambar karya saat diunduh / simpan gambar oleh pengunjung website.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1.5px solid rgba(0,91,171,0.15)' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#005BAB' }}>
                        Status Watermark Gambar
                      </span>

                      {/* Toggle Switch Button */}
                      <button
                        type="button"
                        onClick={handleToggleWatermark}
                        style={{
                          position: 'relative',
                          width: '58px',
                          height: '32px',
                          borderRadius: '999px',
                          backgroundColor: profileForm.watermark_enabled !== false ? '#005BAB' : '#CBD5E1',
                          border: '2px solid #005BAB',
                          cursor: 'pointer',
                          transition: 'background-color 0.25s ease',
                          padding: 0,
                          outline: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={profileForm.watermark_enabled !== false ? 'Klik untuk mematikan watermark' : 'Klik untuk mengaktifkan watermark'}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #005BAB',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transform: profileForm.watermark_enabled !== false ? 'translateX(28px)' : 'translateX(3px)',
                            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {profileForm.watermark_enabled !== false ? (
                            <Check size={14} color="#005BAB" strokeWidth={3} />
                          ) : (
                            <X size={14} color="#DC2626" strokeWidth={3} />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Mode Maintenance Control Card */}
                  <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '2.5px solid #005BAB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#005BAB', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                          <AlertTriangle size={20} />
                          <span>Mode Maintenance</span>
                        </h3>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          background: (profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? '#DCFCE7' : '#FEE2E2',
                          color: (profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? '#15803D' : '#DC2626',
                          border: `1.5px solid ${(profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? '#16A34A' : '#DC2626'}`
                        }}>
                          {(profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? '(ON)' : '(OFF)'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        Jika diaktifkan, halaman beranda akan menampilkan modal pemberitahuan maintenance yang tidak dapat ditutup. Halaman Login dan Dashboard tetap dapat diakses.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1.5px solid rgba(0,91,171,0.15)' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#005BAB' }}>
                        Status Mode Maintenance
                      </span>

                      {/* Toggle Switch Button */}
                      <button
                        type="button"
                        onClick={handleToggleMaintenance}
                        style={{
                          position: 'relative',
                          width: '58px',
                          height: '32px',
                          borderRadius: '999px',
                          backgroundColor: (profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? '#005BAB' : '#CBD5E1',
                          border: '2px solid #005BAB',
                          cursor: 'pointer',
                          transition: 'background-color 0.25s ease',
                          padding: 0,
                          outline: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={(profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? 'Klik untuk mematikan mode maintenance' : 'Klik untuk mengaktifkan mode maintenance'}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #005BAB',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transform: (profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? 'translateX(28px)' : 'translateX(3px)',
                            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {(profileForm.maintenance_mode === true || profileForm.maintenance_mode === 1 || profileForm.maintenance_mode === '1') ? (
                            <Check size={14} color="#005BAB" strokeWidth={3} />
                          ) : (
                            <X size={14} color="#DC2626" strokeWidth={3} />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Pemberitahuan Pengisian Konten Control Card */}
                  <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF', border: '2.5px solid #005BAB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#005BAB', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                          <Bell size={20} />
                          <span>Pemberitahuan Konten</span>
                        </h3>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          background: (profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? '#DCFCE7' : '#FEE2E2',
                          color: (profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? '#15803D' : '#DC2626',
                          border: `1.5px solid ${(profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? '#16A34A' : '#DC2626'}`
                        }}>
                          {(profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? '(ON)' : '(OFF)'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        Jika diaktifkan, setiap pengunjung yang membuka atau me-refresh website akan melihat modal pemberitahuan bahwa website sedang dalam tahap pengisian konten oleh Hamdani.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1.5px solid rgba(0,91,171,0.15)' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#005BAB' }}>
                        Status Modal Pemberitahuan
                      </span>

                      {/* Toggle Switch Button */}
                      <button
                        type="button"
                        onClick={handleToggleContentNotice}
                        style={{
                          position: 'relative',
                          width: '58px',
                          height: '32px',
                          borderRadius: '999px',
                          backgroundColor: (profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? '#005BAB' : '#CBD5E1',
                          border: '2px solid #005BAB',
                          cursor: 'pointer',
                          transition: 'background-color 0.25s ease',
                          padding: 0,
                          outline: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={(profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? 'Klik untuk menonaktifkan modal pemberitahuan konten' : 'Klik untuk mengaktifkan modal pemberitahuan konten'}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #005BAB',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transform: (profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? 'translateX(28px)' : 'translateX(3px)',
                            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {(profileForm.content_notice_enabled !== false && profileForm.content_notice_enabled !== 0 && profileForm.content_notice_enabled !== '0') ? (
                            <Check size={14} color="#005BAB" strokeWidth={3} />
                          ) : (
                            <X size={14} color="#DC2626" strokeWidth={3} />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>        
                </div>
              </div>
            )}

            {/* TAB 1: FORM TAMBAH KARYA BARU */}
            {activeTab === 'tambah-karya' && (
              <div>
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {editingId ? <Edit size={18} /> : <Plus size={18} />}
                      <span>{editingId ? `Edit Data Karya: "${formData.title}"` : 'Form Tambah Karya Baru'}</span>
                    </h3>
                    {editingId && (
                      <button onClick={resetAllForms} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmitKarya}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Judul Karya *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Logo Brand Aetheria"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Kategori Utama *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            const subcats = getSubcategoriesByCategory(newCat);
                            setFormData({
                              ...formData,
                              category: newCat,
                              subcategory: subcats[0]
                            });
                          }}
                          className="form-select"
                        >
                          <option value="desain-grafis">Desain Grafis</option>
                          <option value="multimedia">Multimedia</option>
                          <option value="aplikasi">Aplikasi</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Subkategori *</label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="form-select"
                        >
                          {getSubcategoriesByCategory(formData.category).map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Tahun Pembuatan *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: 2026"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Jenis Proyek *</label>
                        <select
                          required
                          value={formData.project_type || 'Freelance'}
                          onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                          className="form-select"
                        >
                          <option value="Freelance">Freelance</option>
                          <option value="Pekerjaan">Pekerjaan</option>
                          <option value="Iseng">Iseng</option>
                          <option value="Lomba">Lomba</option>
                        </select>
                      </div>

                      {/* KONDISIONAL FIELD: METODE & FRAMEWORK (WEB APP & MOBILE APP) vs PLATFORM & ALAT (UI/UX) vs ALAT / SOFTWARE (SUBCATEGORY LAINNYA) */}
                      {formData.subcategory === 'Web App' || formData.subcategory === 'Mobile App' ? (
                        <>
                          <div className="form-group">
                            <label>Metode Pengembangan / Pengodingan *</label>
                            <select
                              required
                              value={formData.development_method || 'AIAD'}
                              onChange={(e) => setFormData({ ...formData, development_method: e.target.value })}
                              className="form-select"
                            >
                              <option value="AIAD">AIAD</option>
                              <option value="Manual Coding (FrontEnd)">Manual Coding (FrontEnd)</option>
                              <option value="Manual Coding (Full Stack)">Manual Coding (Full Stack)</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Framework yang Digunakan (Opsional / Input Bebas)</label>
                            <input
                              type="text"
                              placeholder="contoh: React, Laravel, Flutter, Vue, Next.js"
                              value={formData.framework || ''}
                              onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                              className="form-input"
                            />
                          </div>
                        </>
                      ) : formData.subcategory === 'UI/UX' || formData.subcategory === 'Desain UI/UX' ? (
                        <>
                          <div className="form-group">
                            <label>Platform *</label>
                            <select
                              required
                              value={formData.platform || 'Website'}
                              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                              className="form-select"
                            >
                              <option value="Website">Website</option>
                              <option value="Mobile">Mobile</option>
                              <option value="Mobile & Website">Mobile & Website</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Alat / Software yang Digunakan *</label>
                            <input
                              type="text"
                              placeholder="contoh: Figma, Adobe XD, Sketch"
                              value={formData.tools_used || ''}
                              onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                              className="form-input"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="form-group">
                          <label>Alat / Software yang Digunakan *</label>
                          <input
                            type="text"
                            placeholder="contoh: Adobe Photoshop, Illustrator, Figma"
                            value={formData.tools_used || ''}
                            onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      )}

                      <div className="form-group">
                        <label>Nama Klien / Proyek (Opsional)</label>
                        <input
                          type="text"
                          placeholder="contoh: Personal / Klien X"
                          value={formData.client}
                          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tags (pisahkan koma)</label>
                        <input
                          type="text"
                          placeholder="Design, Branding, Showcase"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* DYNAMIC FORM FIELDS BASED ON SUBCATEGORY RULES MATRIX */}
                    {(() => {
                      const rules = getSubcategoryRules(formData.subcategory);
                      return (
                        <>
                          {/* 1. UNGGAH FOTO COVER (SAMPUL UTAMA - MAKSIMAL 1 FOTO - WAJIB UNTUK SEMUA) */}
                          <div className="form-group" style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Image size={18} />
                                <span>Unggah Foto Cover / Sampul Utama (Wajib - Maks. 1 Foto) *</span>
                              </label>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#005BAB' }}>
                                Tampilan Sampul Card
                              </span>
                            </div>

                            <div style={{
                              position: 'relative',
                              border: '2.5px dashed #005BAB',
                              borderRadius: 'var(--radius-md)',
                              padding: '1.15rem',
                              background: '#FFF3DD',
                              textAlign: 'center',
                              cursor: 'pointer',
                              marginBottom: '0.75rem'
                            }}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  opacity: 0,
                                  width: '100%',
                                  height: '100%',
                                  cursor: 'pointer'
                                }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', pointerEvents: 'none' }}>
                                <Upload size={24} color="#005BAB" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>
                                  {formData.cover_image ? 'Ganti Foto Cover Sampul Utama' : 'Pilih / Tarik 1 Berkas Foto Cover Sampul Utama'}
                                </span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#005BAB', opacity: 0.8 }}>
                                  (Foto ini digunakan sebagai tampilan cover utama karya di beranda)
                                </span>
                              </div>
                            </div>

                            {formData.cover_image && (
                              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.5rem', background: '#FFFFFF', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1.5px solid #005BAB' }}>
                                <div style={{ position: 'relative', width: '80px', height: '54px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #005BAB' }}>
                                  <img src={formData.cover_image} alt="Cover Sampul" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <button
                                    type="button"
                                    onClick={removeCoverImage}
                                    style={{
                                      position: 'absolute',
                                      top: '2px',
                                      right: '2px',
                                      background: '#005BAB',
                                      color: '#FFFFFF',
                                      borderRadius: '999px',
                                      width: '18px',
                                      height: '18px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      border: '1px solid #FFFFFF'
                                    }}
                                    title="Hapus foto cover"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                                <div>
                                  <span style={{ fontSize: '0.82rem', color: '#005BAB', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <CheckCircle2 size={16} />
                                    <span>Foto Cover Sampul Utama Siap</span>
                                  </span>
                                  <span style={{ fontSize: '0.74rem', color: '#005BAB', opacity: 0.85, fontWeight: 600, display: 'block' }}>
                                    Berhasil dipasang sebagai foto sampul utama karya.
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 2. UNGGAH FOTO GALERI TAMBAHAN (BILA DIPERBOLEHKAN UNTUK SUBKATEGORI INI) */}
                          {rules.maxGallery > 0 && (
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <Image size={18} />
                                  <span>Unggah Foto Galeri (Maksimal {rules.maxGallery} Foto Galeri)</span>
                                </label>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#005BAB' }}>
                                  {formData.gallery_images?.length || 0} / {rules.maxGallery} Foto Galeri
                                </span>
                              </div>

                              {(!formData.gallery_images || formData.gallery_images.length < rules.maxGallery) && (
                                <div style={{
                                  position: 'relative',
                                  border: '2.5px dashed #005BAB',
                                  borderRadius: 'var(--radius-md)',
                                  padding: '1rem',
                                  background: '#FFF3DD',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  marginBottom: '0.75rem'
                                }}>
                                   <input
                                     type="file"
                                     accept="image/*"
                                     multiple={(rules.maxGallery - (formData.gallery_images?.length || 0)) > 1}
                                     onChange={handleGalleryImagesChange}
                                    style={{
                                      position: 'absolute',
                                      inset: 0,
                                      opacity: 0,
                                      width: '100%',
                                      height: '100%',
                                      cursor: 'pointer'
                                    }}
                                  />
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', pointerEvents: 'none' }}>
                                    <Upload size={24} color="#005BAB" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>
                                      Pilih / Tarik hingga {rules.maxGallery - (formData.gallery_images?.length || 0)} Berkas Foto Galeri Lagi
                                    </span>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#005BAB', opacity: 0.8 }}>
                                      (Foto galeri akan muncul di slider pratinjau detail karya)
                                    </span>
                                  </div>
                                </div>
                              )}

                              {formData.gallery_images && formData.gallery_images.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                  {formData.gallery_images.map((imgSrc, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #005BAB' }}>
                                      <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      <button
                                        type="button"
                                        onClick={() => removeGalleryImage(idx)}
                                        style={{
                                          position: 'absolute',
                                          top: '3px',
                                          right: '3px',
                                          background: '#005BAB',
                                          color: '#FFFFFF',
                                          borderRadius: '999px',
                                          width: '20px',
                                          height: '20px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          border: '1px solid #FFFFFF'
                                        }}
                                        title="Hapus foto galeri ini"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* 3. LINK VIDEO (KHUSUS VIDEOGRAFI, MOTION GRAPHIC, FILM) */}
                          {rules.hasVideo && (
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                              <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Video size={18} />
                                <span>Link Video (Google Drive / YouTube) *</span>
                              </label>
                              <input
                                type="url"
                                required
                                placeholder="https://drive.google.com/file/d/... atau https://www.youtube.com/..."
                                value={formData.video_url || ''}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                className="form-input"
                              />
                              <span style={{ fontSize: '0.78rem', color: '#005BAB', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                                <Info size={14} />
                                <span>Mendukung link Google Drive, YouTube, Instagram (Reels/Post), & Vimeo. Pemutar video langsung tampil di modal.</span>
                              </span>
                            </div>
                          )}

                          {/* 3b. PERAN HAMDANI (KHUSUS FILM) */}
                          {formData.subcategory === 'Film' && (
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                              <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Award size={18} />
                                <span>Peran Hamdani Sebagai *</span>
                              </label>
                              <input
                                type="text"
                                placeholder="contoh: Sutradara, Kameraman, Editor, Produser, Penulis Naskah..."
                                value={formData.role || ''}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="form-input"
                              />
                              <span style={{ fontSize: '0.78rem', color: '#005BAB', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                                <Info size={14} />
                                <span>Peran ini akan ditampilkan sebagai badge di detail karya Film.</span>
                              </span>
                            </div>
                          )}

                          {/* 4. LINK COBA PROTOTYPE / APLIKASI (KHUSUS UI/UX, MOBILE APP, WEB APP) */}
                          {rules.hasPrototype && (
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                              <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Link size={18} />
                                <span>{rules.prototypeLabel}</span>
                              </label>
                              <input
                                type="url"
                                placeholder={formData.subcategory === 'UI/UX' ? "https://www.figma.com/proto/..." : "https://app-demo.com..."}
                                value={formData.prototype_url || ''}
                                onChange={(e) => setFormData({ ...formData, prototype_url: e.target.value })}
                                className="form-input"
                              />
                              <span style={{ fontSize: '0.78rem', color: '#005BAB', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                                <Info size={14} />
                                <span>Tombol "{rules.buttonText}" akan muncul pada detail karya untuk dicoba langsung oleh pengunjung.</span>
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <div className="form-group">
                      <label>Deskripsi Karya</label>
                      <textarea
                        placeholder="Tuliskan latar belakang, proses pengerjaan, atau keunggulan karya..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-textarea"
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="featured-check" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 800, color: '#005BAB' }}>
                        Tampilkan sebagai karya Sorotan Utama (Featured Item)
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn-primary">
                        <span>{editingId ? 'Simpan Perubahan' : 'Unggah & Tambah Karya'}</span>
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetAllForms} className="btn-secondary">
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: KELOLA & DAFTAR KARYA */}
            {activeTab === 'kelola-karya' && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFFFF',
                  border: '2.5px solid #005BAB',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Grid size={20} color="#005BAB" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#005BAB' }}>
                      Daftar Karya Portofolio ({filteredKaryaItems.length} Karya)
                    </span>
                  </div>

                  {/* FORM SEARCH BAR DI TAB KELOLA & DAFTAR KARYA */}
                  <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#005BAB' }} />
                    <input
                      type="text"
                      placeholder="Cari judul/klien/kategori..."
                      value={adminSearchQuery}
                      onChange={(e) => {
                        setAdminSearchQuery(e.target.value);
                        setKaryaPage(1);
                      }}
                      className="form-input"
                      style={{
                        paddingLeft: '2.5rem',
                        paddingRight: adminSearchQuery ? '2.5rem' : '1rem',
                        height: '38px',
                        fontSize: '0.84rem',
                        borderRadius: '999px',
                        background: '#FFF3DD',
                        border: '2px solid #005BAB',
                        color: '#005BAB',
                        fontWeight: 700
                      }}
                    />
                    {adminSearchQuery && (
                      <button
                        onClick={() => setAdminSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: '#FFFFFF',
                          border: '1.5px solid #005BAB',
                          borderRadius: '999px',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#005BAB',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button 
                      onClick={() => setActiveTab('tambah-karya')} 
                      className="btn-primary" 
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                    >
                      <Plus size={14} />
                      <span>Tambah Karya Baru</span>
                    </button>
                    {/* <button 
                      onClick={() => setDeletingTarget({ id: 'reset-all', title: 'Semua Sampel Karya Awal', label: 'Reset Data', targetType: 'reset-mock' })}
                      className="btn-secondary" 
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                    >
                      <RefreshCw size={14} />
                      <span>Reset Sampel</span>
                    </button> */}
                  </div>
                </div>

                {/* BAR FILTER KATEGORI & SUBKATEGORI KHUSUS DASHBOARD (100% MANDIRI) */}
                <div style={{
                  background: '#FFFFFF',
                  border: '2.5px solid #005BAB',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}>
                  {/* Category Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#005BAB', marginRight: '0.35rem' }}>
                      Kategori:
                    </span>
                    {[
                      { id: 'all', label: 'Semua Kategori', icon: Grid },
                      { id: 'desain-grafis', label: 'Desain Grafis', icon: Palette },
                      { id: 'multimedia', label: 'Multimedia', icon: Video },
                      { id: 'aplikasi', label: 'Aplikasi', icon: Code }
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isActive = adminKaryaCategory === cat.id;
                      const count = cat.id === 'all'
                        ? effectiveItems.length
                        : effectiveItems.filter(i => i.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setAdminKaryaCategory(cat.id);
                            setAdminKaryaSubcategory('all');
                            setKaryaPage(1);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            border: '2px solid #005BAB',
                            background: isActive ? '#005BAB' : '#FFF3DD',
                            color: isActive ? '#FFFFFF' : '#005BAB',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Icon size={14} />
                          <span>{cat.label} ({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Subcategory Pills (Tampil bila kategori spesifik dipilih) */}
                  {adminKaryaCategory !== 'all' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1.5px solid rgba(0, 91, 171, 0.25)' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#005BAB', marginRight: '0.25rem' }}>
                        Subkategori:
                      </span>
                      {['all', ...getSubcategoriesByCategory(adminKaryaCategory)].map((sub) => {
                        const isSubAll = sub === 'all';
                        const isSubActive = adminKaryaSubcategory === sub;
                        const subCount = isSubAll
                          ? effectiveItems.filter(i => i.category === adminKaryaCategory).length
                          : effectiveItems.filter(i => i.category === adminKaryaCategory && i.subcategory === sub).length;
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              setAdminKaryaSubcategory(sub);
                              setKaryaPage(1);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.25rem 0.7rem',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              border: '1.5px solid #005BAB',
                              background: isSubActive ? '#005BAB' : '#FFFFFF',
                              color: isSubActive ? '#FFFFFF' : '#005BAB',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isSubActive && <Check size={12} />}
                            <span>{isSubAll ? 'Semua' : sub} ({subCount})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {filteredKaryaItems.length === 0 ? (
                  <EmptyStateCard
                    icon={SearchX}
                    title="Tidak Ada Karya Ditemukan"
                    description="Coba ubah kata kunci pencarian atau pilih kategori lain."
                    actionLabel={adminSearchQuery || adminKaryaCategory !== 'all' || adminKaryaSubcategory !== 'all' ? "Reset Filter" : "Tambah Karya Baru"}
                    onAction={() => {
                      if (adminSearchQuery || adminKaryaCategory !== 'all' || adminKaryaSubcategory !== 'all') {
                        setAdminSearchQuery('');
                        setAdminKaryaCategory('all');
                        setAdminKaryaSubcategory('all');
                        setKaryaPage(1);
                      } else {
                        setActiveTab('tambah-karya');
                      }
                    }}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                    {currentKaryaItems.map((item, index) => {
                      const globalIdx = (karyaPage - 1) * ITEMS_PER_PAGE + index;
                      const isFirst = globalIdx === 0;
                      const isLast = globalIdx === filteredKaryaItems.length - 1;

                      return (
                        <div
                          key={item.id}
                          className="herta-card"
                          style={{
                            padding: '1.25rem',
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            border: '2.5px solid #005BAB',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                              <img
                                src={item.images?.[0] || item.image_url}
                                alt=""
                                style={{
                                  width: '72px',
                                  height: '72px',
                                  borderRadius: '14px',
                                  objectFit: 'cover',
                                  border: '2px solid #005BAB',
                                  flexShrink: 0
                                }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                                  <span style={{ background: '#005BAB', color: '#FFFFFF', padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'capitalize' }}>
                                    {item.category?.replace('-', ' ')}
                                  </span>
                                  <span style={{ background: '#FFF3DD', color: '#005BAB', padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, border: '1.5px solid #005BAB' }}>
                                    {item.subcategory}
                                  </span>
                                </div>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {item.title}
                                </h4>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginTop: '0.2rem' }}>
                                  Tahun: {item.year} {item.client ? `• Klien: ${item.client}` : ''}
                                </div>
                              </div>
                            </div>

                            {item.description && (
                              <p style={{
                                fontSize: '0.85rem',
                                color: '#005BAB',
                                fontWeight: 600,
                                lineHeight: 1.5,
                                marginBottom: '1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1.5px solid #005BAB', flexWrap: 'wrap' }}>
                            {/* Tombol Reorder Karya (Paling Atas, Naik, Turun, Paling Bawah) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleReorderKaryaItem(globalIdx, 'top')}
                                className="btn-secondary"
                                style={{ padding: '0.35rem 0.45rem', fontSize: '0.78rem', opacity: isFirst ? 0.3 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
                                title="Geser Paling Atas"
                              >
                                <ChevronsUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleReorderKaryaItem(globalIdx, 'up')}
                                className="btn-secondary"
                                style={{ padding: '0.35rem 0.45rem', fontSize: '0.78rem', opacity: isFirst ? 0.3 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
                                title="Geser ke Atas"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleReorderKaryaItem(globalIdx, 'down')}
                                className="btn-secondary"
                                style={{ padding: '0.35rem 0.45rem', fontSize: '0.78rem', opacity: isLast ? 0.3 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}
                                title="Geser ke Bawah"
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleReorderKaryaItem(globalIdx, 'bottom')}
                                className="btn-secondary"
                                style={{ padding: '0.35rem 0.45rem', fontSize: '0.78rem', opacity: isLast ? 0.3 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}
                                title="Geser Paling Bawah"
                              >
                                <ChevronsDown size={14} />
                              </button>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleEditKaryaClick(item)} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => setDeletingTarget({ id: item.id, title: item.title, label: 'Karya', targetType: 'karya' })} className="btn-danger" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                  {/* Pagination Bar Karya */}
                  {renderPaginationControls(karyaPage, filteredKaryaItems.length, (page) => setKaryaPage(page))}
              </div>
            )}

            {/* TAB 2: KELOLA PENGALAMAN KERJA */}
            {activeTab === 'pengalaman' && (
              <div>
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {editingExpId ? <Edit size={18} /> : <Plus size={18} />}
                    <span>{editingExpId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</span>
                  </h3>

                  <form onSubmit={handleSubmitExperience}>
                    {/* Baris 1: Posisi & Tipe Pengalaman/Pekerjaan */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label>Judul Posisi / Jabatan *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Senior Graphic Designer"
                          value={expForm.title}
                          onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tipe Pengalaman *</label>
                        <select
                          value={expForm.experience_type || 'Kerja'}
                          onChange={(e) => setExpForm({ ...expForm, experience_type: e.target.value })}
                          className="form-select"
                        >
                          <option value="Kerja">Kerja</option>
                          <option value="Magang">Magang</option>
                          <option value="Organisasi">Organisasi</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>

                      {(expForm.experience_type === 'Kerja' || !expForm.experience_type) && (
                        <div className="form-group">
                          <label>Tipe Pekerjaan *</label>
                          <select
                            value={expForm.employment_type || 'Full Time'}
                            onChange={(e) => setExpForm({ ...expForm, employment_type: e.target.value })}
                            className="form-select"
                          >
                            <option value="Full Time">Full Time</option>
                            <option value="Kontrak">Kontrak</option>
                            <option value="Remote">Remote</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Baris 2: Nama Perusahaan & Periode / Tahun */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label>Nama Perusahaan / Studio / Proyek *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Rajasa Creative Project"
                          value={expForm.company}
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Periode / Tahun *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: 2022 — Sekarang"
                          value={expForm.period}
                          onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Deskripsi & Tanggung Jawab (Pisahkan dengan poin/baris baru)</label>
                      <textarea
                        placeholder="• Merancang identitas visual brand...&#10;• Meriset antarmuka pengguna UI/UX..."
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        className="form-textarea"
                      />
                    </div>

                    {/* MEDIA DOKUMENTASI PENGALAMAN (MAKSIMAL 3 FOTO) */}
                    <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Image size={18} />
                          <span>Media Dokumentasi Pengalaman (Maksimal 3 Foto)</span>
                        </label>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, background: '#005BAB', color: '#FFFFFF', padding: '0.15rem 0.6rem', borderRadius: '999px' }}>
                          {expForm.media?.length || 0} / 3 Foto Terunggah
                        </span>
                      </div>

                      {(!expForm.media || expForm.media.length < 3) && (
                        <div style={{
                          position: 'relative',
                          border: '2.5px dashed #005BAB',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.25rem',
                          background: '#FFF3DD',
                          textAlign: 'center',
                          cursor: 'pointer',
                          marginBottom: '0.75rem'
                        }}>
                          <input
                            type="file"
                            accept="image/*"
                            multiple={(3 - (expForm.media?.length || 0)) > 1}
                            onChange={handleExpMediaChange}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              opacity: 0,
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer'
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', pointerEvents: 'none' }}>
                            <Upload size={24} color="#005BAB" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>
                              Pilih / Tarik hingga {3 - (expForm.media?.length || 0)} Berkas Foto Dokumentasi Lagi
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#005BAB', opacity: 0.85 }}>
                              (Otomatis dikompresi ke format WebP resolusi tinggi, rasio 16:9 dengan background blur jika tidak landscape)
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Preview Thumbnails */}
                      {expForm.media && expForm.media.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                          {expForm.media.map((imgSrc, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '76px', height: '76px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #005BAB' }}>
                              <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button
                                type="button"
                                onClick={() => removeExpMedia(idx)}
                                style={{
                                  position: 'absolute',
                                  top: '3px',
                                  right: '3px',
                                  background: '#005BAB',
                                  color: '#FFFFFF',
                                  borderRadius: '999px',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px solid #FFFFFF',
                                  cursor: 'pointer'
                                }}
                                title="Hapus foto ini"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn-primary">
                        <span>{editingExpId ? 'Simpan Perubahan' : 'Tambah Pengalaman'}</span>
                      </button>
                      {editingExpId && (
                        <button type="button" onClick={() => { setEditingExpId(null); setExpForm({ title: '', experience_type: 'Kerja', employment_type: 'Full Time', company: '', period: '', description: '', media: [] }); }} className="btn-secondary">
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* LIST CARD PENGALAMAN (TANPA TABEL + PAGINATION 20 ITEM) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB' }}>
                      Daftar Pengalaman ({filteredExpItems.length} Item{adminSearchQuery ? ` Ditemukan` : ''})
                    </h3>
                  </div>

                  {filteredExpItems.length === 0 ? (
                    <EmptyStateCard
                      icon={SearchX}
                      title="Tidak Ada Pengalaman Ditemukan"
                      description="Coba ubah kata kunci pencarian atau tambah pengalaman."
                      actionLabel={adminSearchQuery ? "Reset Pencarian" : null}
                      onAction={() => setAdminSearchQuery('')}
                    />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
                      {currentExpItems.map((exp) => (
                        <div
                          key={exp.id}
                          className="herta-card"
                          style={{
                            padding: '1.25rem',
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            border: '2.5px solid #005BAB',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#005BAB', margin: 0 }}>{exp.title}</h4>
                                
                                {/* Tipe Pengalaman Badge */}
                                {(() => {
                                  const type = exp.experience_type || 'Kerja';
                                  let bg = '#DCFCE7', color = '#15803D', border = '#16A34A';
                                  if (type === 'Magang') { bg = '#E0F2FE'; color = '#0284C7'; border = '#0284C7'; }
                                  else if (type === 'Organisasi') { bg = '#FEF3C7'; color = '#D97706'; border = '#D97706'; }
                                  else if (type === 'Freelance') { bg = '#F3E8FF'; color = '#7E22CE'; border = '#A855F7'; }

                                  return (
                                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: bg, color: color, border: `1.5px solid ${border}`, padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                                      {type}
                                    </span>
                                  );
                                })()}

                                {/* Tipe Pekerjaan Sub-Badge (Khusus Tipe Kerja) */}
                                {(exp.experience_type === 'Kerja' || !exp.experience_type) && exp.employment_type && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#FFF3DD', color: '#005BAB', border: '1.5px solid #005BAB', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                                    {exp.employment_type}
                                  </span>
                                )}
                              </div>

                              <span style={{ fontSize: '0.78rem', fontWeight: 800, background: '#005BAB', color: '#FFFFFF', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                                {exp.period}
                              </span>
                            </div>
                            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#005BAB', opacity: 0.9, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Building2 size={15} />
                              <span>{exp.company}</span>
                            </h5>
                            {exp.description && (
                              <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, lineHeight: 1.55, whiteSpace: 'pre-line', marginBottom: '0.75rem' }}>
                                {exp.description}
                              </p>
                            )}

                            {/* Media dokumentasi badge / preview count in list card */}
                            {Array.isArray(exp.media) && exp.media.length > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  background: '#FFF3DD',
                                  color: '#005BAB',
                                  border: '1.5px solid #005BAB',
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '999px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}>
                                  <Image size={13} />
                                  <span>{exp.media.length} Foto Dokumentasi</span>
                                </span>
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1.5px solid #005BAB' }}>
                            {(() => {
                              const realIdx = experiences.findIndex(i => i.id === exp.id);
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <button
                                    type="button"
                                    disabled={realIdx <= 0}
                                    onClick={() => handleReorderEntity('experiences', experiences, realIdx, 'up')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx <= 0 ? 0.3 : 1, cursor: realIdx <= 0 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Atas)"
                                  >
                                    <ChevronUp size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={realIdx >= experiences.length - 1}
                                    onClick={() => handleReorderEntity('experiences', experiences, realIdx, 'down')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx >= experiences.length - 1 ? 0.3 : 1, cursor: realIdx >= experiences.length - 1 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Bawah)"
                                  >
                                    <ChevronDown size={15} />
                                  </button>
                                </div>
                              );
                            })()}

                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                              <button onClick={() => {
                                setEditingExpId(exp.id);
                                setExpForm({
                                  title: exp.title || '',
                                  experience_type: exp.experience_type || 'Kerja',
                                  employment_type: exp.employment_type || 'Full Time',
                                  company: exp.company || '',
                                  period: exp.period || '',
                                  description: exp.description || '',
                                  media: Array.isArray(exp.media) ? exp.media : []
                                });
                              }} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => setDeletingTarget({ id: exp.id, title: exp.title, label: 'Pengalaman Kerja', targetType: 'exp' })} className="btn-danger" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Bar Pengalaman */}
                  {renderPaginationControls(expPage, filteredExpItems.length, (page) => setExpPage(page))}
                </div>
              </div>
            )}

            {/* TAB 3: KELOLA DOKUMEN HAMDANI */}
            {activeTab === 'dokumen' && (
              <div>
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {editingDocId ? <Edit size={18} /> : <Plus size={18} />}
                    <span>{editingDocId ? 'Edit Dokumen Hamdani' : 'Tambah Dokumen Baru'}</span>
                  </h3>

                  <form onSubmit={handleSubmitDocument}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Judul Dokumen *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: CV ATS Hamdani"
                          value={docForm.title}
                          onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tipe / Sub-Judul Dokumen *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Curriculum Vitae (ATS Friendly)"
                          value={docForm.type}
                          onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Kategori Dokumen *</label>
                        <select
                          value={docForm.category || 'CV ATS'}
                          onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                          className="form-select"
                          style={{ fontWeight: 800 }}
                        >
                          <option value="CV ATS">CV ATS</option>
                          <option value="CV Kreatif">CV Kreatif</option>
                          <option value="Portofolio">Portofolio</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Nama File *</label>
                        <input
                          type="text"
                          placeholder="CV_ATS_Hamdani.pdf"
                          value={docForm.fileName}
                          onChange={(e) => setDocForm({ ...docForm, fileName: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Unggah Berkas File Dokumen (PDF / Gambar / Doc)</label>
                      <input
                        type="file"
                        onChange={handleDocFileUpload}
                        className="form-input"
                        style={{ padding: '0.5rem' }}
                      />
                      {docForm.fileUrl && (
                        <p style={{ fontSize: '0.78rem', color: '#005BAB', marginTop: '0.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={14} />
                          <span>File siap diunduh ({docForm.fileName || 'File Terlampir'})</span>
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Deskripsi Singkat Dokumen</label>
                      <textarea
                        placeholder="Tuliskan keterangan berkas resmi..."
                        value={docForm.description}
                        onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                        className="form-textarea"
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn-primary">
                        <span>{editingDocId ? 'Simpan Perubahan' : 'Tambah Dokumen'}</span>
                      </button>
                      {editingDocId && (
                        <button type="button" onClick={() => { setEditingDocId(null); setDocForm({ title: '', type: '', description: '', fileUrl: '', fileName: '' }); }} className="btn-secondary">
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* LIST CARD DOKUMEN (TANPA TABEL + PAGINATION 20 ITEM) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB' }}>
                      Daftar Dokumen ({filteredDocItems.length} Dokumen{adminSearchQuery ? ` Ditemukan` : ''})
                    </h3>
                    {/* <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#005BAB', background: '#FFF3DD', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1.5px solid #005BAB' }}>
                      Maksimal 20 Card / Halaman
                    </span> */}
                  </div>

                  {filteredDocItems.length === 0 ? (
                    <EmptyStateCard
                      icon={SearchX}
                      title="Tidak Ada Dokumen Ditemukan"
                      description="Coba ubah kata kunci pencarian atau unggah dokumen baru."
                      actionLabel={adminSearchQuery ? "Reset Pencarian" : null}
                      onAction={() => setAdminSearchQuery('')}
                    />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                      {currentDocItems.map((doc) => (
                        <div
                          key={doc.id}
                          className="herta-card"
                          style={{
                            padding: '1.25rem',
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            border: '2.5px solid #005BAB',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative'
                          }}
                        >
                          <span style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: (doc.category || 'CV ATS') === 'CV Kreatif' ? '#FEF3C7' : (doc.category || 'CV ATS') === 'Portofolio' ? '#D1FAE5' : '#EEF2FF',
                            color: (doc.category || 'CV ATS') === 'CV Kreatif' ? '#D97706' : (doc.category || 'CV ATS') === 'Portofolio' ? '#059669' : '#4F46E5',
                            border: `1.5px solid ${(doc.category || 'CV ATS') === 'CV Kreatif' ? '#D97706' : (doc.category || 'CV ATS') === 'Portofolio' ? '#059669' : '#4F46E5'}`,
                            padding: '0.15rem 0.6rem',
                            borderRadius: '999px',
                            zIndex: 2
                          }}>
                            {doc.category || 'CV ATS'}
                          </span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', paddingRight: '5.5rem' }}>
                              <div style={{ padding: '0.6rem', borderRadius: '12px', background: '#FFF3DD', color: '#005BAB', border: '1.5px solid #005BAB', flexShrink: 0 }}>
                                <FileText size={24} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#005BAB', lineHeight: 1.35, margin: 0, wordBreak: 'break-word' }}>{doc.title}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#005BAB', opacity: 0.85 }}>{doc.type}</span>
                                </div>
                              </div>
                            </div>
                            {doc.fileName && (
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#005BAB', background: '#FFF3DD', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #005BAB', marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <FileText size={13} />
                                <span>File: {doc.fileName}</span>
                              </div>
                            )}
                            {doc.description && (
                              <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, lineHeight: 1.5, marginBottom: '1rem' }}>
                                {doc.description}
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1.5px solid #005BAB' }}>
                            {(() => {
                              const realIdx = documents.findIndex(i => i.id === doc.id);
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <button
                                    type="button"
                                    disabled={realIdx <= 0}
                                    onClick={() => handleReorderEntity('documents', documents, realIdx, 'up')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx <= 0 ? 0.3 : 1, cursor: realIdx <= 0 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Atas)"
                                  >
                                    <ChevronUp size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={realIdx >= documents.length - 1}
                                    onClick={() => handleReorderEntity('documents', documents, realIdx, 'down')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx >= documents.length - 1 ? 0.3 : 1, cursor: realIdx >= documents.length - 1 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Bawah)"
                                  >
                                    <ChevronDown size={15} />
                                  </button>
                                </div>
                              );
                            })()}

                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                              <button onClick={() => { setEditingDocId(doc.id); setDocForm({ ...doc, category: doc.category || 'CV ATS' }); }} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => setDeletingTarget({ id: doc.id, title: doc.title, label: 'Dokumen', targetType: 'doc' })} className="btn-danger" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Bar Dokumen */}
                  {renderPaginationControls(docPage, filteredDocItems.length, (page) => setDocPage(page))}
                </div>
              </div>
            )}

            {/* TAB 4: KELOLA KONTAK */}
            {activeTab === 'kontak' && (
              <div>
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {editingContactId ? <Edit size={18} /> : <Plus size={18} />}
                    <span>{editingContactId ? 'Edit Informasi Kontak' : 'Tambah Kontak Baru'}</span>
                  </h3>

                  <form onSubmit={handleSubmitContact}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Tipe Kontak *</label>
                        <select
                          value={contactForm.type || 'whatsapp'}
                          onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                          className="form-select"
                        >
                          <option value="whatsapp">WhatsApp</option>
                          <option value="email">Email</option>
                          <option value="social">Social Media</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Judul Kontak *</label>
                        <input
                          type="text"
                          required
                          placeholder={
                            contactForm.type === 'email' ? 'contoh: Email Resmi' :
                            contactForm.type === 'social' ? 'contoh: Instagram Portfolio' :
                            'contoh: WhatsApp Direct'
                          }
                          value={contactForm.title || ''}
                          onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          {contactForm.type === 'whatsapp' ? 'No WhatsApp *' :
                           contactForm.type === 'email' ? 'Email *' : 'Nama Social Media *'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={
                            contactForm.type === 'whatsapp' ? 'contoh: +62 812-3456-7890' :
                            contactForm.type === 'email' ? 'contoh: hamdani@example.com' :
                            'contoh: Instagram (@hamdani)'
                          }
                          value={contactForm.value || ''}
                          onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>URL Link (Tujuan saat tombol diklik) *</label>
                        <input
                          type="url"
                          required
                          placeholder={
                            contactForm.type === 'whatsapp' ? 'https://wa.me/6281234567890' :
                            contactForm.type === 'email' ? 'mailto:hamdani@example.com' :
                            'https://instagram.com/username'
                          }
                          value={contactForm.url || ''}
                          onChange={(e) => setContactForm({ ...contactForm, url: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Teks Tombol *</label>
                        <input
                          type="text"
                          required
                          placeholder={
                            contactForm.type === 'whatsapp' ? 'contoh: Chat via WhatsApp' :
                            contactForm.type === 'email' ? 'contoh: Kirim Email' :
                            'contoh: Kunjungi Instagram'
                          }
                          value={contactForm.subtext || ''}
                          onChange={(e) => setContactForm({ ...contactForm, subtext: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn-primary">
                        <span>{editingContactId ? 'Simpan Perubahan' : 'Tambah Kontak'}</span>
                      </button>
                      {editingContactId && (
                        <button type="button" onClick={() => { setEditingContactId(null); setContactForm({ title: '', value: '', url: '', type: 'whatsapp', subtext: '' }); }} className="btn-secondary">
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* LIST CARD KONTAK (TANPA TABEL + PAGINATION 20 ITEM) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB' }}>
                      Daftar Kontak ({filteredContactItems.length} Item{adminSearchQuery ? ` Ditemukan` : ''})
                    </h3>
                    {/* <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#005BAB', background: '#FFF3DD', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1.5px solid #005BAB' }}>
                      Maksimal 20 Card / Halaman
                    </span> */}
                  </div>

                  {filteredContactItems.length === 0 ? (
                    <EmptyStateCard
                      icon={SearchX}
                      title="Tidak Ada Kontak Ditemukan"
                      description="Coba ubah kata kunci pencarian atau tambah info kontak baru."
                      actionLabel={adminSearchQuery ? "Reset Pencarian" : null}
                      onAction={() => setAdminSearchQuery('')}
                    />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem' }}>
                      {currentContactItems.map((c) => (
                        <div
                          key={c.id}
                          className="herta-card"
                          style={{
                            padding: '1.25rem',
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            border: '2.5px solid #005BAB',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div style={{ padding: '0.6rem', borderRadius: '12px', background: '#FFF3DD', color: '#005BAB', border: '1.5px solid #005BAB' }}>
                                <Mail size={22} />
                              </div>
                              <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#005BAB' }}>{c.title}</h4>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#005BAB', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '999px', textTransform: 'capitalize' }}>
                                  {c.type}
                                </span>
                              </div>
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.25rem' }}>
                              {c.value}
                            </div>
                            {c.url && (
                              <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#005BAB', fontWeight: 700, textDecoration: 'underline', wordBreak: 'break-all' }}>
                                {c.url}
                              </a>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', marginTop: '1rem', borderTop: '1.5px solid #005BAB' }}>
                            {(() => {
                              const realIdx = contacts.findIndex(i => i.id === c.id);
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <button
                                    type="button"
                                    disabled={realIdx <= 0}
                                    onClick={() => handleReorderEntity('contacts', contacts, realIdx, 'up')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx <= 0 ? 0.3 : 1, cursor: realIdx <= 0 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Atas)"
                                  >
                                    <ChevronUp size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={realIdx >= contacts.length - 1}
                                    onClick={() => handleReorderEntity('contacts', contacts, realIdx, 'down')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx >= contacts.length - 1 ? 0.3 : 1, cursor: realIdx >= contacts.length - 1 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Bawah)"
                                  >
                                    <ChevronDown size={15} />
                                  </button>
                                </div>
                              );
                            })()}

                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                              <button onClick={() => { setEditingContactId(c.id); setContactForm(c); }} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => setDeletingTarget({ id: c.id, title: c.title, label: 'Kontak', targetType: 'contact' })} className="btn-danger" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Bar Kontak */}
                  {renderPaginationControls(contactPage, filteredContactItems.length, (page) => setContactPage(page))}
                </div>
              </div>
            )}

            {/* TAB: KELOLA SERTIFIKAT */}
            {activeTab === 'sertifikat' && (
              <div>
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {editingCertId ? <Edit size={18} /> : <Plus size={18} />}
                    <span>{editingCertId ? 'Edit Informasi Sertifikat' : 'Tambah Sertifikat Baru'}</span>
                  </h3>

                  <form onSubmit={handleSubmitCertificate}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Nama Sertifikat *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Sertifikasi International UI/UX Design"
                          value={certForm.title || ''}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Kategori *</label>
                        <select
                          value={certForm.category || 'Sertifikasi'}
                          onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                          className="form-select"
                        >
                          <option value="Sertifikasi">Sertifikasi</option>
                          <option value="Penghargaan">Penghargaan</option>
                          <option value="Pelatihan">Pelatihan</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Institusi yang Memberikan *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Google & Coursera Creative Academy"
                          value={certForm.institution || ''}
                          onChange={(e) => setCertForm({ ...certForm, institution: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tahun *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: 2024"
                          value={certForm.year || ''}
                          onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label>Deskripsi Sertifikat</label>
                      <textarea
                        rows={3}
                        placeholder="Deskripsi singkat mengenai sertifikat, kompetensi, atau penghargaan..."
                        value={certForm.description || ''}
                        onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                        className="form-textarea"
                      />
                    </div>

                    {/* 1. UNGGAH FOTO COVER / SAMPUL UTAMA SERTIFIKAT */}
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Image size={18} />
                          <span>Unggah Foto Cover / Sampul Utama (Maksimal 1 Foto) *</span>
                        </label>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#005BAB' }}>
                          Tampilan Sampul Card Sertifikat
                        </span>
                      </div>

                      <div style={{
                        position: 'relative',
                        border: '2.5px dashed #005BAB',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.15rem',
                        background: '#FFF3DD',
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginBottom: '0.75rem'
                      }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCertCoverChange}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', pointerEvents: 'none' }}>
                          <Upload size={24} color="#005BAB" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>
                            {certForm.cover ? 'Ganti Foto Cover Sampul Sertifikat' : 'Pilih / Tarik 1 Berkas Foto Cover Sampul Sertifikat'}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#005BAB', opacity: 0.8 }}>
                            (Otomatis dikompresi ke format WebP resolusi tinggi)
                          </span>
                        </div>
                      </div>

                      {certForm.cover && (
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.5rem', background: '#FFFFFF', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1.5px solid #005BAB' }}>
                          <div style={{ position: 'relative', width: '80px', height: '54px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #005BAB' }}>
                            <img src={certForm.cover} alt="Cover Sampul Sertifikat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={removeCertCoverImage}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                background: '#005BAB',
                                color: '#FFFFFF',
                                borderRadius: '999px',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #FFFFFF',
                                cursor: 'pointer'
                              }}
                              title="Hapus foto cover"
                            >
                              <X size={10} />
                            </button>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.82rem', color: '#005BAB', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <CheckCircle2 size={16} />
                              <span>Foto Sampul Sertifikat Siap</span>
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#005BAB', opacity: 0.85, fontWeight: 600, display: 'block' }}>
                              Berhasil dipasang sebagai foto sampul sertifikat.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. UNGGAH FOTO GALERI TAMBAHAN (MAKSIMAL 3 FOTO) */}
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <label style={{ fontWeight: 800, color: '#005BAB', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Image size={18} />
                          <span>Unggah Foto Galeri (Maksimal 3 Foto Galeri)</span>
                        </label>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#005BAB' }}>
                          {((certForm.gallery || []).filter(Boolean)).length} / 3 Foto Galeri
                        </span>
                      </div>

                      {((certForm.gallery || []).filter(Boolean)).length < 3 && (
                        <div style={{
                          position: 'relative',
                          border: '2.5px dashed #005BAB',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          background: '#FFF3DD',
                          textAlign: 'center',
                          cursor: 'pointer',
                          marginBottom: '0.75rem'
                        }}>
                          <input
                            type="file"
                            accept="image/*"
                            multiple={(3 - ((certForm.gallery || []).filter(Boolean)).length) > 1}
                            onChange={handleCertGalleryChange}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              opacity: 0,
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer'
                            }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', pointerEvents: 'none' }}>
                            <Upload size={24} color="#005BAB" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#005BAB' }}>
                              Pilih / Tarik hingga {3 - ((certForm.gallery || []).filter(Boolean)).length} Berkas Foto Galeri Lagi
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#005BAB', opacity: 0.8 }}>
                              (Foto galeri akan muncul di slider pratinjau detail sertifikat)
                            </span>
                          </div>
                        </div>
                      )}

                      {((certForm.gallery || []).filter(Boolean)).length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                          {(certForm.gallery || []).filter(Boolean).map((imgUrl, index) => (
                            <div key={index} style={{
                              position: 'relative',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              border: '2px solid #005BAB',
                              height: '80px',
                              background: '#FFFFFF'
                            }}>
                              <img src={imgUrl} alt={`Galeri ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button
                                type="button"
                                onClick={() => removeCertGalleryImage(index)}
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  background: '#005BAB',
                                  color: '#FFFFFF',
                                  borderRadius: '999px',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px solid #FFFFFF',
                                  cursor: 'pointer'
                                }}
                                title="Hapus foto galeri ini"
                              >
                                <X size={12} />
                              </button>
                              <span style={{
                                position: 'absolute',
                                bottom: '4px',
                                left: '4px',
                                background: 'rgba(0, 91, 171, 0.85)',
                                color: '#FFFFFF',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}>
                                #{index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn-primary">
                        <span>{editingCertId ? 'Simpan Perubahan' : 'Tambah Sertifikat'}</span>
                      </button>
                      {editingCertId && (
                        <button type="button" onClick={() => { setEditingCertId(null); setCertForm({ title: '', description: '', category: 'Sertifikasi', year: new Date().getFullYear().toString(), institution: '', cover: '', gallery: ['', '', ''] }); }} className="btn-secondary">
                          Batal
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* LIST CARD SERTIFIKAT */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB' }}>
                      Daftar Sertifikat ({filteredCertItems.length} Item{adminSearchQuery ? ` Ditemukan` : ''})
                    </h3>
                  </div>

                  {filteredCertItems.length === 0 ? (
                    <EmptyStateCard
                      icon={SearchX}
                      title="Tidak Ada Sertifikat Ditemukan"
                      description="Coba ubah kata kunci pencarian atau pilih kategori lain."
                      actionLabel={adminSearchQuery ? "Reset Pencarian" : null}
                      onAction={() => setAdminSearchQuery('')}
                    />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                      {currentCertItems.map((cert) => (
                        <div
                          key={cert.id}
                          className="herta-card"
                          style={{
                            padding: '1.25rem',
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            border: '2.5px solid #005BAB',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            {cert.cover && (
                              <div style={{
                                position: 'relative',
                                width: '100%',
                                paddingTop: '56.25%',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1.5px solid #005BAB',
                                marginBottom: '0.75rem',
                                backgroundColor: '#111827'
                              }}>
                                {/* Layer 1: Blurred Backdrop */}
                                <img
                                  src={cert.cover}
                                  alt=""
                                  aria-hidden="true"
                                  style={{
                                    position: 'absolute',
                                    top: '-10%',
                                    left: '-10%',
                                    width: '120%',
                                    height: '120%',
                                    objectFit: 'cover',
                                    filter: 'blur(18px) brightness(0.6) saturate(1.4)',
                                    transform: 'scale(1.05)',
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                    zIndex: 1
                                  }}
                                />
                                {/* Layer 2: Main Contained Image */}
                                <img
                                  src={cert.cover}
                                  alt={cert.title}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    objectPosition: 'center center',
                                    zIndex: 2
                                  }}
                                />
                              </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#005BAB', color: '#FFFFFF', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
                                {cert.category}
                              </span>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#FFF3DD', color: '#005BAB', padding: '0.15rem 0.55rem', borderRadius: '999px', border: '1px solid #005BAB' }}>
                                {cert.year}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005BAB', marginBottom: '0.25rem' }}>{cert.title}</h4>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#005BAB', opacity: 0.85, marginBottom: '0.5rem' }}>
                              {cert.institution}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', marginTop: '1rem', borderTop: '1.5px solid #005BAB' }}>
                            {(() => {
                              const realIdx = certificates.findIndex(i => i.id === cert.id);
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <button
                                    type="button"
                                    disabled={realIdx <= 0}
                                    onClick={() => handleReorderEntity('certificates', certificates, realIdx, 'up')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx <= 0 ? 0.3 : 1, cursor: realIdx <= 0 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Atas)"
                                  >
                                    <ChevronUp size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={realIdx >= certificates.length - 1}
                                    onClick={() => handleReorderEntity('certificates', certificates, realIdx, 'down')}
                                    className="btn-secondary"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: realIdx >= certificates.length - 1 ? 0.3 : 1, cursor: realIdx >= certificates.length - 1 ? 'not-allowed' : 'pointer' }}
                                    title="Atur Urutan Posisi (Geser ke Bawah)"
                                  >
                                    <ChevronDown size={15} />
                                  </button>
                                </div>
                              );
                            })()}

                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                              <button onClick={() => {
                                setEditingCertId(cert.id);
                                setCertForm({
                                  title: cert.title || '',
                                  description: cert.description || '',
                                  category: cert.category || 'Sertifikasi',
                                  year: cert.year || '',
                                  institution: cert.institution || '',
                                  cover: cert.cover || '',
                                  gallery: [
                                    (cert.gallery && cert.gallery[0]) || '',
                                    (cert.gallery && cert.gallery[1]) || '',
                                    (cert.gallery && cert.gallery[2]) || ''
                                  ]
                                });
                              }} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => setDeletingTarget({ id: cert.id, title: cert.title, label: 'Sertifikat', targetType: 'certificate' })} className="btn-danger" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                                <Trash2 size={14} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {renderPaginationControls(certPage, filteredCertItems.length, (page) => setCertPage(page))}
                </div>
              </div>
            )}

            {/* TAB: KELOLA KLIEN */}
            {activeTab === 'klien' && (
              <div>
                {/* Form Tambah / Edit Klien */}
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {editingClientId ? <Edit size={18} /> : <PlusCircle size={18} />}
                    <span>{editingClientId ? 'Edit Data Klien' : 'Tambah Klien Baru'}</span>
                  </h3>

                    <form onSubmit={handleSubmitClient}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                        {/* Nama Klien */}
                        <div className="form-group">
                          <label>Nama Klien / Perusahaan / Brand (Opsional)</label>
                          <input
                            type="text"
                            placeholder="contoh: Aetheria Labs Inc. (opsional, boleh kosong)"
                            value={clientForm.name || ''}
                            onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        {/* Upload Logo Klien (Rasio 1:1 Square) */}
                        <div className="form-group">
                          <label>Logo Klien (Rasio Kotak 1:1) *</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleClientLogoChange}
                            className="form-input"
                            style={{ padding: '0.45rem' }}
                          />
                          <span style={{ fontSize: '0.74rem', color: '#005BAB', opacity: 0.8, display: 'block', marginTop: '0.25rem' }}>
                            File akan otomatis dikompresi ke format WebP resolusi tinggi (rasio 1:1).
                          </span>
                        </div>
                      </div>

                    {/* Preview Logo Klien (Sesuai Lampiran 1) */}
                    {clientForm.logo && (
                      <div style={{ marginTop: '0.2rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#005BAB', display: 'block', marginBottom: '0.5rem' }}>
                          Preview Logo Klien:
                        </span>
                        <div style={{
                          position: 'relative',
                          width: '100px',
                          height: '100px',
                          aspectRatio: '1 / 1',
                          borderRadius: '20px',
                          border: '2.5px solid #005BAB',
                          background: '#FFFFFF',
                          padding: '0.4rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img src={clientForm.logo} alt="Preview Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '14px' }} />
                          <button
                            type="button"
                            onClick={() => setClientForm(prev => ({ ...prev, logo: '' }))}
                            style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-10px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#005BAB',
                              color: '#FFFFFF',
                              border: '2px solid #FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0, 91, 171, 0.35)',
                              zIndex: 10
                            }}
                            title="Hapus Logo"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                      <button type="submit" className="btn-primary">
                        <span>{editingClientId ? 'Simpan Perubahan Klien' : 'Tambah Klien'}</span>
                      </button>
                      {editingClientId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingClientId(null);
                            setClientForm({ name: '', logo: '' });
                          }}
                          className="btn-secondary"
                        >
                          Batal Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List Daftar Klien */}
                <div className="herta-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={18} />
                    <span>Daftar Klien Hamdani ({clients.length})</span>
                  </h3>

                  {clients.length === 0 ? (
                    <EmptyStateCard
                      icon={Building2}
                      title="Belum Ada Klien Ditambahkan"
                      description="Silakan tambahkan logo dan nama klien yang pernah bekerja sama dengan Hamdani."
                    />
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '1.25rem'
                    }}>
                      {clients.map((client, index) => (
                        <div
                          key={client.id}
                          style={{
                            background: '#FFF3DD',
                            border: '2.5px solid #005BAB',
                            borderRadius: '30px',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.85rem',
                            position: 'relative'
                          }}
                        >
                          {/* Logo (Rasio Kotak 1:1) */}
                          <div style={{
                            width: '100px',
                            height: '100px',
                            aspectRatio: '1 / 1',
                            borderRadius: '16px',
                            background: '#FFFFFF',
                            border: '2px solid #005BAB',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            {client.logo ? (
                              <img src={client.logo} alt={client.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                              <Building2 size={36} color="#005BAB" />
                            )}
                          </div>

                          <div style={{ textAlign: 'center', width: '100%' }}>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#005BAB', margin: 0, wordBreak: 'break-word' }}>
                              {client.name || 'Tanpa Nama'}
                            </h4>
                          </div>

                          {/* Tombol Reorder, Edit, Hapus */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                              disabled={index === 0}
                              onClick={() => handleReorderClient(index, 'up')}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.55rem', opacity: index === 0 ? 0.4 : 1 }}
                              title="Geser Naik"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              disabled={index === clients.length - 1}
                              onClick={() => handleReorderClient(index, 'down')}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.55rem', opacity: index === clients.length - 1 ? 0.4 : 1 }}
                              title="Geser Turun"
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingClientId(client.id);
                                setClientForm({ name: client.name || '', logo: client.logo || '' });
                              }}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeletingTarget({ id: client.id, title: client.name || 'Klien', label: 'Klien', targetType: 'client' })}
                              className="btn-danger"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            >
                              <Trash2 size={14} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: KELOLA PROFIL HAMDANI */}
            {activeTab === 'profil' && (
              <div>
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={18} />
                    <span>Edit Profil & Bio Hamdani</span>
                  </h3>

                  <form onSubmit={handleSubmitProfile}>
                    {/* Nama */}
                    <div className="form-group">
                      <label>Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    {/* Tagline - Bahasa Indonesia & Inggris */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Tagline (Bahasa Indonesia) *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Desainer Grafis, Kreator Multimedia & Developer Web"
                          value={profileForm.tagline || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tagline (English Version)</label>
                        <input
                          type="text"
                          placeholder="e.g. Graphic Designer, Multimedia Creator & Web Developer"
                          value={profileForm.tagline_en || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, tagline_en: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* Bio - Bahasa Indonesia & Inggris */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Bio / Deskripsi (Bahasa Indonesia)</label>
                        <textarea
                          rows={4}
                          placeholder="Tuliskan bio singkat dalam bahasa Indonesia..."
                          value={profileForm.bio || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          className="form-textarea"
                        />
                      </div>

                      <div className="form-group">
                        <label>Bio / Description (English Version)</label>
                        <textarea
                          rows={4}
                          placeholder="Write a short bio in English..."
                          value={profileForm.bio_en || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, bio_en: e.target.value })}
                          className="form-textarea"
                        />
                      </div>
                    </div>

                    {/* Domisili & Data Diri (Bahasa Indonesia & English) */}
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1.5px solid #005BAB' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005BAB', marginBottom: '1rem' }}>
                        Informasi Domisili & Data Diri
                      </h4>

                      {/* Domisili */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                          <label>Domisili (Bahasa Indonesia)</label>
                          <input
                            type="text"
                            placeholder="contoh: Kota Jambi, Indonesia"
                            value={profileForm.domisili || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, domisili: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Domicile (English Version)</label>
                          <input
                            type="text"
                            placeholder="e.g. Jambi City, Indonesia"
                            value={profileForm.domisili_en || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, domisili_en: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      {/* Tempat Tinggal Sekarang */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                          <label>Tempat Tinggal Sekarang (Bahasa Indonesia)</label>
                          <input
                            type="text"
                            placeholder="contoh: Kota Jambi, Indonesia"
                            value={profileForm.tempat_tinggal || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, tempat_tinggal: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Current Residence (English Version)</label>
                          <input
                            type="text"
                            placeholder="e.g. Jambi City, Indonesia"
                            value={profileForm.tempat_tinggal_en || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, tempat_tinggal_en: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      {/* Tempat Tanggal Lahir */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                          <label>Tempat, Tanggal Lahir (Bahasa Indonesia)</label>
                          <input
                            type="text"
                            placeholder="contoh: Jambi, 14 Mei 1998"
                            value={profileForm.ttl || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ttl: e.target.value })}
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Place, Date of Birth (English Version)</label>
                          <input
                            type="text"
                            placeholder="e.g. Jambi, May 14, 1998"
                            value={profileForm.ttl_en || ''}
                            onChange={(e) => setProfileForm({ ...profileForm, ttl_en: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                      <button type="submit" className="btn-primary">
                        <span>Simpan Perubahan Profil</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* --- SEKSI KELOLA KEAHLIAN & SPESIALISASI --- */}
                <div className="herta-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#005BAB', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={20} />
                    <span>Kelola Keahlian & Spesialisasi Utama</span>
                  </h3>

                  {/* Form Tambah / Edit Keahlian */}
                  <form onSubmit={handleSubmitSkill} style={{ background: '#FFF3DD', padding: '1.25rem', borderRadius: '16px', border: '2px solid #005BAB', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005BAB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {editingSkillId ? <Edit size={16} /> : <Plus size={16} />}
                      <span>{editingSkillId ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}</span>
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Nama Bidang (Bahasa Indonesia) *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Desain Grafis"
                          value={skillForm.title}
                          onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Nama Bidang (English Version)</label>
                        <input
                          type="text"
                          placeholder="e.g. Graphic Design"
                          value={skillForm.title_en}
                          onChange={(e) => setSkillForm({ ...skillForm, title_en: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Kategori Keahlian *</label>
                        <select
                          value={skillForm.category || 'Soft Skill'}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          className="form-select"
                        >
                          <option value="Soft Skill">Soft Skill</option>
                          <option value="Hard Skill">Hard Skill</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Deskripsi (Bahasa Indonesia) *</label>
                        <input
                          type="text"
                          required
                          placeholder="contoh: Desain Logo, Poster, Banner, Kemasan, Lainnya."
                          value={skillForm.desc}
                          onChange={(e) => setSkillForm({ ...skillForm, desc: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Deskripsi (English Version)</label>
                        <input
                          type="text"
                          placeholder="e.g. Logo, Poster, Banner, Packaging & Visual Branding Design."
                          value={skillForm.desc_en}
                          onChange={(e) => setSkillForm({ ...skillForm, desc_en: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}>
                        <span>{editingSkillId ? 'Simpan Perubahan Keahlian' : 'Tambah Keahlian'}</span>
                      </button>
                      {editingSkillId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkillId(null);
                            setSkillForm({ title: '', title_en: '', desc: '', desc_en: '' });
                          }}
                          className="btn-secondary"
                          style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </form>

                  {/* List Cards Keahlian */}
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005BAB', marginBottom: '1rem' }}>
                      Daftar Keahlian & Spesialisasi ({(profileForm.skills || []).length} Item)
                    </h4>

                    {(!profileForm.skills || profileForm.skills.length === 0) ? (
                      <div style={{ padding: '1.5rem', background: '#FFF3DD', borderRadius: '12px', border: '1.5px dashed #005BAB', textAlign: 'center', color: '#005BAB', fontWeight: 700 }}>
                        Belum ada keahlian yang ditambahkan. Gunakan formulir di atas untuk menambahkan keahlian baru.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem' }}>
                        {(profileForm.skills || []).map((skill, idx) => (
                          <div
                            key={skill.id || idx}
                            className="herta-card"
                            style={{
                              padding: '1.25rem',
                              background: '#FFFFFF',
                              borderRadius: '16px',
                              border: '2.5px solid #005BAB',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <div style={{ marginBottom: '0.45rem' }}>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  background: skill.category === 'Hard Skill' ? '#10B981' : '#005BAB',
                                  color: '#FFFFFF',
                                  padding: '0.15rem 0.6rem',
                                  borderRadius: '999px',
                                  display: 'inline-block'
                                }}>
                                  {skill.category || 'Soft Skill'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontWeight: 800, color: '#005BAB', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                                <Award size={20} color="#005BAB" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ wordBreak: 'break-word', lineHeight: 1.35 }}>{skill.title}</span>
                              </div>
                              {skill.title_en && skill.title_en !== skill.title && (
                                <div style={{ fontSize: '0.78rem', color: '#005BAB', opacity: 0.8, fontWeight: 700, marginBottom: '0.4rem' }}>
                                  EN: {skill.title_en}
                                </div>
                              )}
                              <p style={{ fontSize: '0.85rem', color: '#005BAB', fontWeight: 600, lineHeight: 1.5 }}>
                                {skill.desc}
                              </p>
                              {skill.desc_en && skill.desc_en !== skill.desc && (
                                <p style={{ fontSize: '0.78rem', color: '#005BAB', opacity: 0.8, fontWeight: 600, marginTop: '0.3rem' }}>
                                  EN: {skill.desc_en}
                                </p>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', marginTop: '1rem', borderTop: '1.5px solid #005BAB' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <button
                                  type="button"
                                  disabled={idx <= 0}
                                  onClick={() => handleReorderEntity('skills', profileForm.skills || [], idx, 'up')}
                                  className="btn-secondary"
                                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: idx <= 0 ? 0.3 : 1, cursor: idx <= 0 ? 'not-allowed' : 'pointer' }}
                                  title="Atur Urutan Posisi (Geser ke Atas)"
                                >
                                  <ChevronUp size={15} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx >= (profileForm.skills || []).length - 1}
                                  onClick={() => handleReorderEntity('skills', profileForm.skills || [], idx, 'down')}
                                  className="btn-secondary"
                                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', opacity: idx >= (profileForm.skills || []).length - 1 ? 0.3 : 1, cursor: idx >= (profileForm.skills || []).length - 1 ? 'not-allowed' : 'pointer' }}
                                  title="Atur Urutan Posisi (Geser ke Bawah)"
                                >
                                  <ChevronDown size={15} />
                                </button>
                              </div>
                              <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleEditSkillClick(skill)}
                                  className="btn-secondary"
                                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                                >
                                  <Edit size={14} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingTarget({ id: skill.id, title: skill.title, label: 'Keahlian', targetType: 'skill' })}
                                  className="btn-danger"
                                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                                >
                                  <Trash2 size={14} />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      <style>{`
        /* Hide scrollbars visually across all dashboard containers while retaining full scrollability */
        .admin-sidebar-layout::-webkit-scrollbar,
        .admin-sidebar::-webkit-scrollbar,
        .admin-sidebar-menu::-webkit-scrollbar,
        .admin-content-main::-webkit-scrollbar,
        .admin-app-wrapper::-webkit-scrollbar,
        .hide-scrollbar::-webkit-scrollbar,
        .modal-no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .admin-sidebar-layout,
        .admin-sidebar,
        .admin-sidebar-menu,
        .admin-content-main,
        .admin-app-wrapper {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        @media (max-width: 860px) {
          .admin-sidebar-layout {
            flex-direction: column !important;
            overflow-y: auto !important;
          }
          .admin-app-wrapper {
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          .admin-sidebar {
            display: none !important;
          }
          .admin-mobile-header {
            display: flex !important;
          }
          .admin-content-main {
            height: auto !important;
            padding: 1.25rem 0.85rem 3rem !important;
          }
        }
        @media (min-width: 861px) {
          .admin-mobile-header {
            display: none !important;
          }
          .admin-mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
