import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  Search,
  Users,
  BookOpen,
  PieChart,
  RefreshCw,
  Check,
  Link as LinkIcon,
  FileBadge, 
  ChevronDown,
  ChevronUp,
  File,
  FileQuestion,
  PlayCircle,
  Video,
  FilePlus,
  FolderUp,
  MessageCircle,
  Filter,
  Info,
  X,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

// --- Types ---
type Status = 'Belum Mulai' | 'Dalam Proses' | 'Selesai';
type ReviewResult = 'relevant' | 'needs_update' | null;

interface AdditionalMaterial {
  title: string;
  link: string;
}

interface TrainingMaterial {
  id: string;
  title: string;
  link: string;
  status: Status;
  lastUpdated: string;
  // New fields for review logic
  reviewResult: ReviewResult;
  updateLink?: string;
  kapLink?: string; 
  quizLink?: string; 
  videoLink?: string;
  supplementLink?: string; 
  folderLink?: string; 
  additionalMaterials?: AdditionalMaterial[]; 
  additionalVideos?: AdditionalMaterial[];
  additionalSupplements?: AdditionalMaterial[]; 
}

interface Widyaiswara {
  id: string;
  name: string;
  phoneNumber?: string;
  assignedMaterials: TrainingMaterial[];
}

// --- Mock Data ---
const INITIAL_DATA_SOURCE: Widyaiswara[] = [
  {
    id: 'WI-001',
    name: 'Achmat Subekan',
    phoneNumber: '08123631258',
    assignedMaterials: [
       { id: 'TR-25', title: 'Microlearning Tata Cara Pembayaran PMK 62/2023', link: 'https://klc2.kemenkeu.go.id/document/2023/11/3/1698978050401xzr/tata_cara_pembayaran_pmk_62_2023.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2025/1/14/1736839213276iaq/microlearning_tata_cara_pembayaran_menurut_pmk_nomor_62pmk.052023.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/e924fb47-cf11-4779-b5f2-7242983d8296', videoLink: 'https://klc2.kemenkeu.go.id/video/2023/11/16/1700117742749aoe/tata_cara_pembayaran_menurut_pmk_62_tahun_2023_bagian_1.mp4', 
         additionalVideos: [
           { title: 'Bagian 2', link: 'https://klc2.kemenkeu.go.id/video/2023/11/16/1700118226074jag/tata_cara_pembayaran_menurut_pmk_62_tahun_2023_bagian_2.mp4' }
         ],
         folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgBbNSWMG6suRp3IuzqRNSk1ATrKQJ1h8agc6POcY5hk7S8?e=5dyjGq'
       },
       { id: 'TR-26', title: 'Materi 1: Analisis Advokasi Kebijakan Perbendaharaan (JF Ahli Madya)', link: 'https://klc2.kemenkeu.go.id/document/2025/4/23/1745389540526dcs/bt_advokasi_madya_level_4_reviu_dsp_20022025.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2025/4/8/1744092641223sjj/2025_e_learning_jabatan_fungsional_analis_pengelolaan_keuangan_apbn_ahli_madya.docx.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/a1e86ab8-f459-407e-b1dc-1a2d5889abd9', folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgBP6mhvHpGeTa_nXcaE-UYtAZOIUWYpV88pEqaL0fh3l5w?e=6jQo1s' },
       { id: 'TR-27', title: 'Materi 1: Pengantar Ekonomi Makro dan Kebijakan Fiskal', link: 'https://klc2.kemenkeu.go.id/document/2025/9/8/1757299095635kjd/1._kelembagaan_penggunaan_anggaran_e_learning__pengantar_mkn_2025.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2023/1/18/1674011182215spg/kap_e_learning_mkn_dasar__pengantar_manajemen_keuangan_negaradocx.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/e05d1cf8-5419-4801-8824-269d26b7deab', videoLink: 'https://klc2.kemenkeu.go.id/video/2020/7/7/1594088551231qvu/kd1-tujuanbernegara.mp4',
         additionalVideos: [
           { title: 'KD2 Pemkepem', link: 'https://klc2.kemenkeu.go.id/video/2020/7/7/1594088663555tem/kd2-pemkepem.mp4' },
           { title: 'KD3 4 Sektor', link: 'https://klc2.kemenkeu.go.id/video/2020/7/7/1594088736019ymu/kd3-4sektorcv.mp4' },
           { title: 'KD4 Kebijakan Fiskal Moneter', link: 'https://klc2.kemenkeu.go.id/video/2020/7/7/1594088808737xsy/kd4-kebijakanfiskalmonetercv.mp4' },
           { title: 'KD5 Pengantar Neraca Pembayaran', link: 'https://klc2.kemenkeu.go.id/video/2020/7/7/1594089210685bzr/kd5-pengantar_neraca_pembayaran.mp4' }
         ],
         supplementLink: 'https://drive.google.com/drive/folders/1OmrfPTjsEYu5nuICEm34AYb_OMOZExJn?usp=sharing',
         folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgAd5hVET4CtTaiY_Yyt4XsvAXXX3IswQrvabWPkCEiml7M?e=ZS1Djb'
       },
       { id: 'TR-28', title: 'Materi I: Persiapan Pelaksanaan Anggaran', link: 'https://klc2.kemenkeu.go.id/document/2025/1/15/1736934245917hpe/1._persiapan_pa_skpp_elearning_pelaks_angg_skpp_reviewed_9_januari_2025_by_subekan.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2021/5/6/1620286383433jrb/26032020_v0_kap_e-learning_pelaksanaan_anggaran_skpp_stempel.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/5e6cd979-8208-443c-8323-36d3cd5ab432', videoLink: 'https://klc2.kemenkeu.go.id/video/2023/7/20/1689813497227imo/1._persiapan_pelaksanaan_anggaran.mp4',
         additionalVideos: [
           { title: 'Cara Menurunkan Jadwal Kegiatan (KMS)', link: 'https://klc2.kemenkeu.go.id/kms/knowledge/klc1-pusap-cara-menurunkan-jadwal-kegiatan-harian-bulanan-menjadi-rencana-penarikan-dana-harian/detail/' },
           { title: 'Rencana Penarikan Dana Satker (KMS)', link: 'https://klc2.kemenkeu.go.id/kms/knowledge/klc1-pusap-rencana-penarikan-dana-satuan-kerja/detail/' }
         ],
         supplementLink: 'https://klc2.kemenkeu.go.id/document/2022/3/20/1647754281373edi/suplemen_persiapan_pelaksanaan_anggaran_reviewed_22_april.pdf',
         additionalSupplements: [
           { title: 'Pelaksanaan RPD Harian 2023', link: 'https://klc2.kemenkeu.go.id/document/2023/7/10/1688974222274zpo/pelaksanaan_rpd_harian_tahun_2023.pdf' }
         ],
         folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgDd5MWKU1aFRLW3Hflo9anWAQpe4wmrYFCMS38mWzgSCKk?e=6u23VO'
       }
    ]
  },
  {
    id: 'WI-002',
    name: 'Noor Cholis Madjid',
    phoneNumber: '081319038979',
    assignedMaterials: [
       { id: 'TR-61', title: 'E-Learning Verifikasi Tagihan Belanja Perjadin Luar Negeri', link: 'https://klc2.kemenkeu.go.id/document/2020/7/21/1595304327486klz/2.-ppspm-perjadin-luar-negeri-noor-c-madjid_edited.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2021/5/6/1620286985292byd/kap_perjadin_ln.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/a4621f41-554b-4f94-ac57-0e82bc074381', videoLink: 'https://klc2.kemenkeu.go.id/video/2020/7/21/1595303289039rte/konsep-perjalanan-dinas-luar-negeri-conv.m4v',
         additionalVideos: [
           { title: 'Studi Kasus Perjadin LN', link: 'https://klc2.kemenkeu.go.id/video/2020/7/21/1595304293362yyv/studi-kasus-perjalanan-dinas-luar-negeri-conv.m4v' },
           { title: 'SCORM Studi Kasus Perjadin LN', link: 'https://klc2.kemenkeu.go.id/scorm/2023/7/5/1688533199709mvf/StudiKasusPerjadinLuarNegeri/index_html5.html' }
         ],
         supplementLink: 'https://klc2.kemenkeu.go.id/document/2020/7/21/1595304351296zpi/164_pmk.05_2015per-tata-cara-perdin-luar-negeri.pdf',
         additionalSupplements: [
           { title: 'PMK 181 Tahun 2019', link: 'https://klc2.kemenkeu.go.id/document/2022/3/15/1647331042944ytm/pmk_181_tahun_2019.pdf' },
           { title: 'SPM 1647 Perjadin 3rd Finance Ministers', link: 'https://klc2.kemenkeu.go.id/document/2025/6/2/1748827009772rzg/vitrie_spm_1647_perjadin_3rd_finance_ministers.pdf' }
         ],
         folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgDv1xyZ_lKoRLMVaW67Mhi0ARFo5j3SqaquPHWtum8JeYI?e=EIvdGA'
       }
    ]
  },
  {
    id: 'WI-003',
    name: 'Bambang Sancoko',
    phoneNumber: '081380624300',
    assignedMaterials: [
       { id: 'TR-62', title: 'Materi 3: PBJ Pemerintah dengan Penyedia UMKK', link: 'https://klc2.kemenkeu.go.id/document/2022/6/13/1655108170213uad/pbjp_dengan_penyedia_usaha_mikro_kecil_dan_koperasi_klc_v1.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2022/6/20/1655696594046nvn/e-learning_pemberdayaan_umkk_pada_belanja_satker_1.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/f6e6e3e0-8dbd-4a52-9b7b-365f8828a3af', videoLink: 'https://klc2.kemenkeu.go.id/scorm/2022/7/4/1656893951946hxe/UMKK33062022/index_html5.html', folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgAmIucA9ng4RIeYIJ8hF1jlAYSc6V5wXB3nXNhLsewR9Xo?e=aeAziN' }
    ]
  },
  {
    id: 'WI-004',
    name: 'Dwi Ari Wibawa',
    phoneNumber: '085229010482',
    assignedMaterials: [
       { id: 'TR-16', title: 'Microlearning Pemilihan Jenis Kontrak dan Konsekuensinya', link: 'https://klc2.kemenkeu.go.id/document/2025/8/6/1754461298319vgr/ppl_ppk_pemilihan_kontrak_dan_konsekuensinya1.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2025/8/7/1754547763247nvg/kam_pemilihan_jenis_kontrak_dan_konsekuensinya.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/e2363d2b-9825-4e90-bc03-1127adf651d5', videoLink: 'https://klc2.kemenkeu.go.id/video/2023/2/15/1676424529818kaw/pemilihan_jenis_kontrak_dan_konsekuensinya.mp4', folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgDRLkYm9gXyT7ReEnr6QvwyAY0ZElrKw_H08s-SAoc0cg0?e=g4aI9x' },
       { id: 'TR-17', title: 'Materi 7: Pengelolaan Kontrak PBJ Menengah (JF Penyelia)', link: 'https://klc2.kemenkeu.go.id/document/2025/5/14/1747187673535poq/k_pengadaan_barang_jasa_pemerintah_dan_pengelolaan_pbj_pemerintah_secara_swakelola_menengah.pptx.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2025/4/11/1744362352594iuu/2025_e_learning_jabatan_fungsional_pranata_pengelolaan_keuangan_apbn_penyelia.docx.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/a5c66180-1187-4246-9bde-5411418ade35', folderLink: 'https://kemenkeu.sharepoint.com/:f:/s/TimKerjaLearningValueChainCAP03/IgDMX9Z2d9oFSYaTGGvdAJSiAT8H9jHkinF4HlByaTZedOk?e=qsLmNT' },
       { id: 'TR-18', title: 'E-Learning Verifikasi Tagihan Belanja Barang Non Pegawai', link: 'https://klc2.kemenkeu.go.id/document/2025/4/11/1744346394647fvv/slide_e_learning_pengujian_belanja_non_pegawai_revisi_2025.pdf', status: 'Belum Mulai', lastUpdated: '2025-02-24', reviewResult: null, updateLink: '', kapLink: 'https://klc2.kemenkeu.go.id/document/2021/5/6/1620287047632tzn/kap_el_non_pegawai.pdf', quizLink: 'https://klc2.kemenkeu.go.id/office/team/lms/quiz/4e669902-7932-4bb9-ad16-76daedfe4798', videoLink: 'https://klc2.kemenkeu.go.id/video/2022/4/20/1650416926993pua/seri1_pengujian_belanja_non_pegawai.mp4',
         additionalVideos: [
           { title: 'Seri 2 Pengujian Belanja Non Pegawai', link: 'https://klc2.kemenkeu.go.id/video/2022/4/20/1650416959185edu/seri2_pengujian_belanja_non_pegawai.mp4' },
           { title: 'Seri 3 Pengujian Belanja Non Pegawai', link: 'https://klc2.kemenkeu.go.id/video/2022/4/20/1650416989734bwi/seri3_pengujian_belanja_non_pegawai.mp4' }
         ]
       }
    ]
  }
];

// --- Components ---

const WelcomeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold">Kertas Kerja Monitoring 2026</h2>
          <p className="text-blue-100 text-sm mt-1">Panduan Singkat Pengkinian Materi</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900">Cek Materi Lama</h3>
              <p className="text-sm text-gray-600 mt-1">Buka dan pelajari materi KLC eksisting yang ditugaskan kepada Anda.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900">Reviu Relevansi</h3>
              <p className="text-sm text-gray-600 mt-1">Tentukan apakah materi masih <span className="font-medium text-green-600">Relevan</span> atau <span className="font-medium text-red-600">Perlu Update</span>.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900">Lampirkan Update</h3>
              <p className="text-sm text-gray-600 mt-1">Jika perlu update, lampirkan link materi baru langsung di kolom yang tersedia.</p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow flex items-center gap-2"
          >
            Saya Mengerti
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
             <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Monitoring Open Access 2026</h1>
            <p className="text-sm text-gray-500 font-medium">Kertas Kerja Pengkinian Materi KLC</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
            Tahun Anggaran 2026
          </div>
        </div>
      </div>
    </div>
  </header>
);

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  showHelp
}: { 
  searchTerm: string; 
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  showHelp: () => void;
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
    <div className="flex gap-4 w-full md:w-auto flex-1">
      <div className="relative flex-1 md:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
          placeholder="Cari widyaiswara atau judul materi..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="relative min-w-[160px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter className="h-4 w-4 text-gray-500" />
        </div>
        <select
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none cursor-pointer"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="All">Semua Status</option>
          <option value="Belum Mulai">Belum Mulai</option>
          <option value="Dalam Proses">Dalam Proses</option>
          <option value="Selesai">Selesai</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
    
    <button 
      onClick={showHelp}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
    >
      <HelpCircle className="w-4 h-4" />
      Panduan
    </button>
  </div>
);

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    'Belum Mulai': 'bg-gray-100 text-gray-600 border-gray-200 icon-gray-400',
    'Dalam Proses': 'bg-blue-50 text-blue-700 border-blue-200 icon-blue-500',
    'Selesai': 'bg-green-50 text-green-700 border-green-200 icon-green-500'
  };

  const icons = {
    'Belum Mulai': Clock,
    'Dalam Proses': RefreshCw,
    'Selesai': CheckCircle2
  };

  const Icon = icons[status];
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status].split(' ')[0]} ${styles[status].split(' ')[1]} ${styles[status].split(' ')[2]}`}>
      <Icon className={`w-3.5 h-3.5 mr-1.5 ${styles[status].split(' ')[3]}`} />
      {status}
    </span>
  );
};

const MaterialCard = ({ 
  material, 
  onUpdate 
}: { 
  material: TrainingMaterial; 
  onUpdate: (id: string, field: keyof TrainingMaterial, value: any) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReviewChange = (result: ReviewResult) => {
    onUpdate(material.id, 'reviewResult', result);
    // Auto update status if needed
    if (result === 'relevant') {
       onUpdate(material.id, 'status', 'Selesai');
    } else if (result === 'needs_update') {
       onUpdate(material.id, 'status', 'Dalam Proses');
    }
  };

  return (
    <div className={`bg-white rounded-xl border transition-all duration-200 ${
      material.reviewResult === 'needs_update' ? 'border-amber-200 shadow-sm' : 
      material.reviewResult === 'relevant' ? 'border-green-200 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                  {material.id}
                </span>
                <StatusBadge status={material.status} />
             </div>
             <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 hover:text-blue-700 transition-colors">
               <a href={material.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                 {material.title}
                 <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
               </a>
             </h3>
             <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-3">
                <a href={material.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline">
                  <FileText className="w-4 h-4" /> Materi Utama
                </a>
                {material.kapLink && (
                  <a href={material.kapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline">
                    <FileBadge className="w-4 h-4" /> KAP
                  </a>
                )}
                {material.quizLink && (
                  <a href={material.quizLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 hover:underline">
                    <FileQuestion className="w-4 h-4" /> Kuis
                  </a>
                )}
             </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Action Area */}
        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Review Decision */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Status Reviu Materi
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleReviewChange('relevant')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border font-medium transition-all ${
                  material.reviewResult === 'relevant'
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-sm ring-1 ring-green-500'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <Check className="w-4 h-4" /> Relevan
              </button>
              <button
                onClick={() => handleReviewChange('needs_update')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border font-medium transition-all ${
                  material.reviewResult === 'needs_update'
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm ring-1 ring-amber-500'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <RefreshCw className="w-4 h-4" /> Perlu Update
              </button>
            </div>
          </div>

          {/* Update Input */}
          <div className={`transition-all duration-300 ${material.reviewResult === 'needs_update' ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none grayscale'}`}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Link Materi Pembaruan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tempel link Google Drive / Sharepoint..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={material.updateLink || ''}
                onChange={(e) => onUpdate(material.id, 'updateLink', e.target.value)}
                disabled={material.reviewResult !== 'needs_update'}
              />
            </div>
            {material.reviewResult === 'needs_update' && !material.updateLink && (
               <p className="text-xs text-amber-600 mt-1.5 flex items-center">
                 <AlertCircle className="w-3 h-3 mr-1" /> Mohon lampirkan link materi baru
               </p>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="bg-gray-50 px-5 py-4 rounded-b-xl border-t border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Videos */}
             <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" /> Video Pembelajaran
                </h4>
                <div className="space-y-2">
                  {material.videoLink ? (
                    <a href={material.videoLink} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600 group bg-white p-2 rounded border border-gray-200">
                      <PlayCircle className="w-4 h-4 mr-2 text-red-500 group-hover:scale-110 transition-transform" />
                      Video Utama
                    </a>
                  ) : <span className="text-sm text-gray-400 italic">Tidak ada video utama</span>}
                  
                  {material.additionalVideos?.map((vid, idx) => (
                    <a key={idx} href={vid.link} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600 group bg-white p-2 rounded border border-gray-200">
                      <PlayCircle className="w-4 h-4 mr-2 text-gray-400 group-hover:text-red-500 transition-colors" />
                      {vid.title}
                    </a>
                  ))}
                </div>
             </div>
             
             {/* Supplements */}
             <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FolderUp className="w-4 h-4 text-amber-600" /> Bahan Pendukung
                </h4>
                <div className="space-y-2">
                  {material.folderLink && (
                    <a href={material.folderLink} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600 bg-white p-2 rounded border border-gray-200">
                       <FolderUp className="w-4 h-4 mr-2 text-blue-500" /> Folder Materi
                    </a>
                  )}
                  {material.supplementLink && (
                    <a href={material.supplementLink} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600 bg-white p-2 rounded border border-gray-200">
                       <File className="w-4 h-4 mr-2 text-gray-400" /> Suplemen Utama
                    </a>
                  )}
                  {material.additionalSupplements?.map((sup, idx) => (
                    <a key={idx} href={sup.link} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-600 hover:text-blue-600 bg-white p-2 rounded border border-gray-200">
                      <File className="w-4 h-4 mr-2 text-gray-400" /> {sup.title}
                    </a>
                  ))}
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const WidyaiswaraSection = ({ 
  data, 
  onUpdate 
}: { 
  data: Widyaiswara; 
  onUpdate: (id: string, field: keyof TrainingMaterial, value: any) => void;
}) => {
  // Check completion
  const total = data.assignedMaterials.length;
  const reviewed = data.assignedMaterials.filter(m => m.reviewResult !== null).length;
  const progress = Math.round((reviewed / total) * 100);

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-20 z-20">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
             {data.name.charAt(0)}
           </div>
           <div>
             <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
             <div className="flex items-center text-sm text-gray-500 mt-0.5">
               <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium mr-2">{data.id}</span>
               {data.phoneNumber && <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {data.phoneNumber}</span>}
             </div>
           </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-6">
          <div className="text-right">
             <div className="text-sm font-medium text-gray-500 mb-1">Progres Reviu</div>
             <div className="flex items-center gap-2">
                <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-sm font-bold text-blue-700">{progress}%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.assignedMaterials.map((material) => (
          <MaterialCard 
            key={material.id} 
            material={material} 
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState<Widyaiswara[]>(INITIAL_DATA_SOURCE);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showWelcome, setShowWelcome] = useState(true);

  // Filter Logic
  const filteredData = useMemo(() => {
    return data.map(wi => {
      // If searching by WI Name
      if (wi.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return wi;
      }
      
      // Filter materials
      const filteredMaterials = wi.assignedMaterials.filter(mat => {
        const matchesSearch = mat.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || mat.status === statusFilter;
        return matchesSearch && matchesStatus;
      });

      if (filteredMaterials.length > 0) {
        return { ...wi, assignedMaterials: filteredMaterials };
      }
      return null;
    }).filter(Boolean) as Widyaiswara[];
  }, [data, searchTerm, statusFilter]);

  const handleUpdate = (materialId: string, field: keyof TrainingMaterial, value: any) => {
    setData(prev => prev.map(wi => ({
      ...wi,
      assignedMaterials: wi.assignedMaterials.map(mat => {
        if (mat.id === materialId) {
          return { ...mat, [field]: value };
        }
        return mat;
      })
    })));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Instruction Banner - Persistent Simplified Version */}
        <div className="mb-8 bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
           <div className="flex gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                 <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Petunjuk Pengerjaan</h3>
                <p className="text-sm text-gray-600 mt-1 max-w-xl">
                  Silakan reviu materi yang ditugaskan di bawah ini. Tentukan statusnya apakah masih relevan atau perlu diperbarui. Jangan lupa klik tombol "Panduan" jika Anda membutuhkan bantuan kembali.
                </p>
              </div>
           </div>
        </div>

        <FilterBar 
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          showHelp={() => setShowWelcome(true)}
        />

        {filteredData.length > 0 ? (
          filteredData.map(wi => (
            <WidyaiswaraSection 
              key={wi.id} 
              data={wi} 
              onUpdate={handleUpdate} 
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Data tidak ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter status.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);