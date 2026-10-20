import React, { useState, useMemo } from 'react';
import {
  Building2,
  Package,
  ShoppingCart,
  Truck,
  Users,
  LayoutDashboard,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  MapPin,
  Phone,
  Mail,
  Boxes,
  Check,
  DollarSign,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

// --- MOCK DATA INICIAL ---
const INITIAL_OBRAS = [
  { id: 'obr-1', nome: 'Residencial Vista do Vale', endereco: 'Rua das Flores, 120 - Savassi, BH', status: 'Em Andamento', progresso: 65, orcamento: 1250000, dataInicio: '2026-01-15' },
  { id: 'obr-2', nome: 'Edifício Horizon Tower', endereco: 'Av. Afonso Pena, 1500 - Centro, BH', status: 'Em Andamento', progresso: 32, orcamento: 4800000, dataInicio: '2026-04-01' },
  { id: 'obr-3', nome: 'Galpão Logístico Express', endereco: 'Rodovia BR-040, Km 12 - Contagem', status: 'Pausada', progresso: 15, orcamento: 890000, dataInicio: '2026-02-10' },
  { id: 'obr-4', nome: 'Reforma Centro Comercial', endereco: 'Rua Sergipe, 400 - Savassi, BH', status: 'Concluída', progresso: 100, orcamento: 320000, dataInicio: '2025-11-01' },
];

const INITIAL_FORNECEDORES = [
  { id: 'for-1', nomeFantasia: 'Cimento & Cia Distribuidora', cnpj: '12.345.678/0001-90', telefone: '(31) 3333-1000', email: 'vendas@cimentocia.com.br', segmento: 'Cimento e Agregados' },
  { id: 'for-2', nomeFantasia: 'AçoForte Estruturas S.A.', cnpj: '98.765.432/0001-10', telefone: '(31) 3444-2000', email: 'contato@acoforte.com.br', segmento: 'Aço e Armações' },
  { id: 'for-3', nomeFantasia: 'HidroElétrica Materiais', cnpj: '45.678.901/0001-22', telefone: '(31) 3555-3000', email: 'comercial@hidroeletrica.com.br', segmento: 'Hidráulica e Elétrica' },
  { id: 'for-4', nomeFantasia: 'Cerâmica & Bloco Minas', cnpj: '33.222.111/0001-55', telefone: '(31) 3666-4000', email: 'atendimento@ceramicaminas.com.br', segmento: 'Alvenaria' },
];

const INITIAL_MATERIAIS = [
  { id: 'mat-1', nome: 'Cimento CP II-E-32 (Saco 50kg)', categoria: 'Estrutural', unidade: 'saco', precoMedio: 38.50 },
  { id: 'mat-2', nome: 'Aço CA-50 10.0mm (Vergalhão 12m)', categoria: 'Estrutural', unidade: 'barra', precoMedio: 42.00 },
  { id: 'mat-3', nome: 'Areia Média Lavada', categoria: 'Agregados', unidade: 'm³', precoMedio: 110.00 },
  { id: 'mat-4', nome: 'Brita N° 1 (19mm)', categoria: 'Agregados', unidade: 'm³', precoMedio: 95.00 },
  { id: 'mat-5', nome: 'Bloco Cerâmico 11.5x19x29cm', categoria: 'Alvenaria', unidade: 'unidade', precoMedio: 2.80 },
  { id: 'mat-6', nome: 'Tubo PVC Esgoto 100mm (Barra 6m)', categoria: 'Hidráulica', unidade: 'barra', precoMedio: 68.00 },
  { id: 'mat-7', nome: 'Tinta Acrílica Branca (Lata 18L)', categoria: 'Acabamento', unidade: 'lata', precoMedio: 280.00 },
  { id: 'mat-8', nome: 'Cabo Flexível 2.5mm² 750V (Rolo 100m)', categoria: 'Elétrica', unidade: 'rolo', precoMedio: 185.00 },
];

const INITIAL_ESTOQUE = [
  { id: 'est-1', materialId: 'mat-1', obraId: 'obr-1', quantidade: 120, minEstoque: 50 },
  { id: 'est-2', materialId: 'mat-2', obraId: 'obr-1', quantidade: 18, minEstoque: 60 },
  { id: 'est-3', materialId: 'mat-3', obraId: 'obr-1', quantidade: 25, minEstoque: 20 },
  { id: 'est-4', materialId: 'mat-5', obraId: 'obr-1', quantidade: 2400, minEstoque: 1000 },
  { id: 'est-5', materialId: 'mat-1', obraId: 'obr-2', quantidade: 40, minEstoque: 100 },
  { id: 'est-6', materialId: 'mat-2', obraId: 'obr-2', quantidade: 120, minEstoque: 80 },
  { id: 'est-7', materialId: 'mat-6', obraId: 'obr-2', quantidade: 5, minEstoque: 30 },
  { id: 'est-8', materialId: 'mat-8', obraId: 'obr-2', quantidade: 12, minEstoque: 10 },
  { id: 'est-9', materialId: 'mat-1', obraId: 'central', quantidade: 300, minEstoque: 100 },
  { id: 'est-10', materialId: 'mat-4', obraId: 'central', quantidade: 80, minEstoque: 30 },
  { id: 'est-11', materialId: 'mat-7', obraId: 'central', quantidade: 15, minEstoque: 20 },
];

const INITIAL_PEDIDOS = [
  {
    id: 'PED-2026-001',
    obraId: 'obr-1',
    fornecedorId: 'for-2',
    dataPedido: '2026-10-14',
    previsaoEntrega: '2026-10-22',
    status: 'Pendente',
    valorTotal: 4200.00,
    itens: [{ materialId: 'mat-2', quantidade: 100, precoUnitario: 42.00 }]
  },
  {
    id: 'PED-2026-002',
    obraId: 'obr-2',
    fornecedorId: 'for-3',
    dataPedido: '2026-10-12',
    previsaoEntrega: '2026-10-18',
    status: 'Aprovado',
    valorTotal: 1700.00,
    itens: [{ materialId: 'mat-6', quantidade: 25, precoUnitario: 68.00 }]
  },
  {
    id: 'PED-2026-003',
    obraId: 'obr-1',
    fornecedorId: 'for-1',
    dataPedido: '2026-10-05',
    previsaoEntrega: '2026-10-10',
    status: 'Entregue',
    valorTotal: 3850.00,
    itens: [{ materialId: 'mat-1', quantidade: 100, precoUnitario: 38.50 }]
  }
];

const INITIAL_ENTREGAS = [
  {
    id: 'ENT-2026-001',
    pedidoId: 'PED-2026-003',
    obraId: 'obr-1',
    dataEntrega: '2026-10-10 14:30',
    notaFiscal: 'NF-89421',
    responsavel: 'Eng. Carlos Silva',
    observacoes: 'Recebido sem avarias na obra Residencial Vista do Vale.',
    itensEntregues: [{ materialId: 'mat-1', quantidade: 100 }]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [obras, setObras] = useState(INITIAL_OBRAS);
  const [fornecedores, setFornecedores] = useState(INITIAL_FORNECEDORES);
  const [materiais, setMateriais] = useState(INITIAL_MATERIAIS);
  const [estoque, setEstoque] = useState(INITIAL_ESTOQUE);
  const [pedidos, setPedidos] = useState(INITIAL_PEDIDOS);
  const [entregas, setEntregas] = useState(INITIAL_ENTREGAS);

  const [filterObraId, setFilterObraId] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const [isNovaObraOpen, setIsNovaObraOpen] = useState(false);
  const [isNovoMaterialOpen, setIsNovoMaterialOpen] = useState(false);
  const [isNovoPedidoOpen, setIsNovoPedidoOpen] = useState(false);
  const [isNovoFornecedorOpen, setIsNovoFornecedorOpen] = useState(false);
  const [isRegistrarEntregaOpen, setIsRegistrarEntregaOpen] = useState(false);
  const [selectedPedidoForEntrega, setSelectedPedidoForEntrega] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getObraName = (id) => {
    if (id === 'central') return 'Almoxarifado Central';
    const obra = obras.find(o => o.id === id);
    return obra ? obra.nome : 'N/A';
  };

  const getFornecedorName = (id) => {
    const f = fornecedores.find(item => item.id === id);
    return f ? f.nomeFantasia : 'N/A';
  };

  const getMaterialDetails = (id) => {
    return materiais.find(m => m.id === id) || { nome: 'Material Desconhecido', unidade: 'un' };
  };

  const getStockStatus = (quantidade, minEstoque) => {
    if (quantidade <= minEstoque * 0.5) return { label: 'CRÍTICO', color: 'bg-red-500/10 text-red-600 border-red-200' };
    if (quantidade <= minEstoque) return { label: 'BAIXO', color: 'bg-amber-500/10 text-amber-600 border-amber-200' };
    return { label: 'OK', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
  };

  const kpiData = useMemo(() => {
    const obrasAtivas = obras.filter(o => o.status === 'Em Andamento').length;
    let estoqueCriticoCount = 0;
    estoque.forEach(item => { if (item.quantidade <= item.minEstoque) estoqueCriticoCount++; });
    const pedidosPendentes = pedidos.filter(p => p.status === 'Pendente' || p.status === 'Aprovado').length;
    let valorTotalEstoque = 0;
    estoque.forEach(item => {
      const mat = materiais.find(m => m.id === item.materialId);
      if (mat) valorTotalEstoque += item.quantidade * (mat.precoMedio || 0);
    });
    return { obrasAtivas, estoqueCriticoCount, pedidosPendentes, valorTotalEstoque };
  }, [obras, estoque, pedidos, materiais]);

  const itemsComEstoqueBaixo = useMemo(() => {
    return estoque
      .filter(item => item.quantidade <= item.minEstoque)
      .map(item => {
        const mat = getMaterialDetails(item.materialId);
        const status = getStockStatus(item.quantidade, item.minEstoque);
        return { ...item, nomeMaterial: mat.nome, unidade: mat.unidade, status };
      });
  }, [estoque, materiais]);

  const handleCreateObra = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newObra = {
      id: `obr-${Date.now()}`,
      nome: formData.get('nome'),
      endereco: formData.get('endereco'),
      status: formData.get('status') || 'Em Andamento',
      progresso: Number(formData.get('progresso')) || 0,
      orcamento: Number(formData.get('orcamento')) || 0,
      dataInicio: formData.get('dataInicio') || new Date().toISOString().split('T')[0]
    };
    setObras([...obras, newObra]);
    setIsNovaObraOpen(false);
    showToast(`Obra "${newObra.nome}" cadastrada com sucesso!`);
  };

  const handleCreateMaterial = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMaterial = {
      id: `mat-${Date.now()}`,
      nome: formData.get('nome'),
      categoria: formData.get('categoria'),
      unidade: formData.get('unidade'),
      precoMedio: Number(formData.get('precoMedio')) || 0
    };
    setMateriais([...materiais, newMaterial]);
    const newStock = {
      id: `est-${Date.now()}`,
      materialId: newMaterial.id,
      obraId: 'central',
      quantidade: Number(formData.get('qtdInicial')) || 0,
      minEstoque: Number(formData.get('minEstoque')) || 10
    };
    setEstoque([...estoque, newStock]);
    setIsNovoMaterialOpen(false);
    showToast(`Material "${newMaterial.nome}" adicionado ao catálogo!`);
  };

  const handleCreateFornecedor = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFornecedor = {
      id: `for-${Date.now()}`,
      nomeFantasia: formData.get('nomeFantasia'),
      cnpj: formData.get('cnpj'),
      telefone: formData.get('telefone'),
      email: formData.get('email'),
      segmento: formData.get('segmento')
    };
    setFornecedores([...fornecedores, newFornecedor]);
    setIsNovoFornecedorOpen(false);
    showToast(`Fornecedor "${newFornecedor.nomeFantasia}" cadastrado com sucesso!`);
  };

  const handleCreatePedido = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obraId = formData.get('obraId');
    const fornecedorId = formData.get('fornecedorId');
    const materialId = formData.get('materialId');
    const quantidade = Number(formData.get('quantidade'));
    const precoUnitario = Number(formData.get('precoUnitario'));
    const valorTotal = quantidade * precoUnitario;

    const newPedido = {
      id: `PED-2026-${Math.floor(100 + Math.random() * 900)}`,
      obraId, fornecedorId,
      dataPedido: new Date().toISOString().split('T')[0],
      previsaoEntrega: formData.get('previsaoEntrega'),
      status: 'Pendente',
      valorTotal,
      itens: [{ materialId, quantidade, precoUnitario }]
    };
    setPedidos([newPedido, ...pedidos]);
    setIsNovoPedidoOpen(false);
    showToast(`Pedido ${newPedido.id} criado com sucesso!`);
  };

  const handleUpdatePedidoStatus = (pedidoId, newStatus) => {
    setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, status: newStatus } : p));
    showToast(`Status do Pedido ${pedidoId} alterado para "${newStatus}".`);
  };

  const handleConfirmEntrega = (e) => {
    e.preventDefault();
    if (!selectedPedidoForEntrega) return;

    const formData = new FormData(e.target);
    const notaFiscal = formData.get('notaFiscal');
    const responsavel = formData.get('responsavel');
    const observacoes = formData.get('observacoes');

    const newEntrega = {
      id: `ENT-2026-${Math.floor(100 + Math.random() * 900)}`,
      pedidoId: selectedPedidoForEntrega.id,
      obraId: selectedPedidoForEntrega.obraId,
      dataEntrega: new Date().toLocaleString('pt-BR'),
      notaFiscal, responsavel, observacoes,
      itensEntregues: selectedPedidoForEntrega.itens
    };

    let updatedEstoque = [...estoque];
    selectedPedidoForEntrega.itens.forEach(item => {
      const existingEstoqueIndex = updatedEstoque.findIndex(
        e => e.materialId === item.materialId && e.obraId === selectedPedidoForEntrega.obraId
      );
      if (existingEstoqueIndex >= 0) {
        updatedEstoque[existingEstoqueIndex] = {
          ...updatedEstoque[existingEstoqueIndex],
          quantidade: updatedEstoque[existingEstoqueIndex].quantidade + item.quantidade
        };
      } else {
        updatedEstoque.push({
          id: `est-${Date.now()}-${Math.random()}`,
          materialId: item.materialId,
          obraId: selectedPedidoForEntrega.obraId,
          quantidade: item.quantidade,
          minEstoque: 10
        });
      }
    });

    const updatedPedidos = pedidos.map(p =>
      p.id === selectedPedidoForEntrega.id ? { ...p, status: 'Entregue' } : p
    );

    setEstoque(updatedEstoque);
    setEntregas([newEntrega, ...entregas]);
    setPedidos(updatedPedidos);
    setIsRegistrarEntregaOpen(false);
    setSelectedPedidoForEntrega(null);
    showToast(`Entrega confirmada! Estoque atualizado.`);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-400">
          <CheckCircle2 size={20} />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-lg text-slate-950 font-bold">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide leading-none">ObraEstoque</h1>
              <p className="text-xs text-slate-400 mt-1">ERP de Canteiro & Materiais</p>
            </div>
          </div>
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
              { id: 'obras', label: 'Obras & Projetos', icon: Building2 },
              { id: 'estoque', label: 'Materiais & Estoque', icon: Package },
              { id: 'pedidos', label: 'Pedidos de Compra', icon: ShoppingCart },
              { id: 'entregas', label: 'Recebimentos / Entregas', icon: Truck },
              { id: 'fornecedores', label: 'Fornecedores', icon: Users },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30 font-semibold' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400">ENG</div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">Engenheiro / Almoxarife</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase Sync Ativo
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
        <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white capitalize">
              {activeTab === 'dashboard' && 'Visão Geral do Canteiro'}
              {activeTab === 'obras' && 'Obras & Projetos Ativos'}
              {activeTab === 'estoque' && 'Controle de Materiais e Estoque'}
              {activeTab === 'pedidos' && 'Pedidos de Compra'}
              {activeTab === 'entregas' && 'Recebimento de Materiais nas Obras'}
              {activeTab === 'fornecedores' && 'Cadastro de Fornecedores'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'obras' && (
              <button onClick={() => setIsNovaObraOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                <Plus size={16} /> Nova Obra
              </button>
            )}
            {activeTab === 'estoque' && (
              <button onClick={() => setIsNovoMaterialOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                <Plus size={16} /> Novo Material
              </button>
            )}
            {activeTab === 'pedidos' && (
              <button onClick={() => setIsNovoPedidoOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                <Plus size={16} /> Criar Pedido
              </button>
            )}
            {activeTab === 'fornecedores' && (
              <button onClick={() => setIsNovoFornecedorOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                <Plus size={16} /> Cadastrar Fornecedor
              </button>
            )}
          </div>
        </header>

        <div className="md:hidden bg-slate-950 border-b border-slate-800 flex overflow-x-auto p-2 gap-1 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'obras', label: 'Obras', icon: Building2 },
            { id: 'estoque', label: 'Estoque', icon: Package },
            { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
            { id: 'entregas', label: 'Entregas', icon: Truck },
            { id: 'fornecedores', label: 'Fornecedores', icon: Users },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium shrink-0 ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                <Icon size={14} /> {item.label}
              </button>
            );
          })}
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Obras em Andamento</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{kpiData.obrasAtivas}</h3>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400"><Building2 size={24} /></div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Alertas de Estoque</p>
                    <h3 className="text-2xl font-bold text-amber-400 mt-1">{kpiData.estoqueCriticoCount}</h3>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400"><AlertTriangle size={24} /></div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pedidos em Aberto</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{kpiData.pedidosPendentes}</h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><ShoppingCart size={24} /></div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Valor em Estoque</p>
                    <h3 className="text-xl font-bold text-white mt-1">{formatMoney(kpiData.valorTotalEstoque)}</h3>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400"><DollarSign size={24} /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-100 flex items-center gap-2"><ShieldAlert className="text-amber-400" size={20} /> Itens em Nível Crítico</h3>
                    <button onClick={() => setActiveTab('estoque')} className="text-xs text-blue-400 hover:text-blue-300 font-medium">Ver Completo</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase">
                        <tr><th className="p-3">Material</th><th className="p-3">Local</th><th className="p-3">Qtd Atual</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {itemsComEstoqueBaixo.map(item => (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3 font-medium text-slate-200">{item.nomeMaterial}</td>
                            <td className="p-3 text-slate-400 text-xs">{getObraName(item.obraId)}</td>
                            <td className="p-3 font-semibold text-slate-100">{item.quantidade} {item.unidade}</td>
                            <td className="p-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.status.color}`}>{item.status.label}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2"><Truck className="text-blue-400" size={20} /> Recebimentos Pendentes</h3>
                  <div className="space-y-3">
                    {pedidos.filter(p => p.status === 'Aprovado').map(p => (
                      <div key={p.id} className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-amber-400">PEDIDO APROVADO</span>
                        </div>
                        <p className="text-xs text-slate-300">{getFornecedorName(p.fornecedorId)} → {getObraName(p.obraId)}</p>
                        <button
                          onClick={() => { setSelectedPedidoForEntrega(p); setIsRegistrarEntregaOpen(true); }}
                          className="w-full bg-amber-500 text-slate-950 text-xs font-bold py-1.5 rounded-lg"
                        >Registrar Recebimento</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'obras' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {obras.map(obra => (
                <div key={obra.id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 space-y-4">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-blue-500/10 text-blue-400 border-blue-500/30">{obra.status}</span>
                    <h3 className="text-lg font-bold text-white mt-2">{obra.nome}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={14} /> {obra.endereco}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300"><span>Progresso</span><span className="font-bold">{obra.progresso}%</span></div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5"><div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${obra.progresso}%` }}></div></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'estoque' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Filter size={18} className="text-slate-400" />
                  <select value={filterObraId} onChange={(e) => setFilterObraId(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 outline-none">
                    <option value="todas">Todas as Localizações</option>
                    <option value="central">Almoxarifado Central</option>
                    {obras.map(o => (<option key={o.id} value={o.id}>{o.nome}</option>))}
                  </select>
                </div>
                <div className="relative w-full md:w-72">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
                  <input type="text" placeholder="Buscar material..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 outline-none" />
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                      <tr><th className="p-4">Material</th><th className="p-4">Local / Obra</th><th className="p-4">Qtd em Estoque</th><th className="p-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {estoque.filter(item => filterObraId === 'todas' || item.obraId === filterObraId)
                        .filter(item => {
                          const mat = getMaterialDetails(item.materialId);
                          return mat.nome.toLowerCase().includes(searchTerm.toLowerCase());
                        })
                        .map(item => {
                          const mat = getMaterialDetails(item.materialId);
                          const status = getStockStatus(item.quantidade, item.minEstoque);
                          return (
                            <tr key={item.id} className="hover:bg-slate-800/40">
                              <td className="p-4 font-semibold text-slate-100">{mat.nome}</td>
                              <td className="p-4 text-slate-300 text-xs">{getObraName(item.obraId)}</td>
                              <td className="p-4 font-bold text-slate-100">{item.quantidade} <span className="text-xs font-normal text-slate-400">{mat.unidade}</span></td>
                              <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>{status.label}</span></td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="space-y-4">
              {pedidos.map(pedido => (
                <div key={pedido.id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 text-amber-400 font-bold text-xs">{pedido.id}</div>
                      <div>
                        <h4 className="font-bold text-slate-100">{getObraName(pedido.obraId)}</h4>
                        <p className="text-xs text-slate-400">Fornecedor: <span className="text-slate-200">{getFornecedorName(pedido.fornecedorId)}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold border bg-blue-500/10 text-blue-400 border-blue-500/30">{pedido.status}</span>
                      {pedido.status === 'Pendente' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdatePedidoStatus(pedido.id, 'Aprovado')} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Aprovar</button>
                          <button onClick={() => handleUpdatePedidoStatus(pedido.id, 'Cancelado')} className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold">Cancelar</button>
                        </div>
                      )}
                      {pedido.status === 'Aprovado' && (
                        <button onClick={() => { setSelectedPedidoForEntrega(pedido); setIsRegistrarEntregaOpen(true); }} className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Truck size={14} /> Registrar Entrega
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                    <div className="flex gap-4">
                      <span>Data Pedido: <strong className="text-slate-300">{pedido.dataPedido}</strong></span>
                    </div>
                    <div className="text-sm font-bold text-slate-100">Total: <span className="text-emerald-400">{formatMoney(pedido.valorTotal)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'entregas' && (
            <div className="space-y-4">
              {entregas.map(ent => (
                <div key={ent.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{ent.notaFiscal}</span>
                      <h4 className="font-bold text-slate-100 text-sm mt-1">{getObraName(ent.obraId)}</h4>
                    </div>
                    <span className="text-xs text-slate-400">{ent.dataEntrega}</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                    <p><strong className="text-slate-400">Recebido por:</strong> {ent.responsavel}</p>
                    {ent.observacoes && <p><strong className="text-slate-400">Obs:</strong> {ent.observacoes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fornecedores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fornecedores.map(f => (
                <div key={f.id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div>
                    <h3 className="font-bold text-white text-base mt-1.5">{f.nomeFantasia}</h3>
                    <p className="text-xs text-slate-400">CNPJ: {f.cnpj}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-700/50 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><Phone size={14} className="text-slate-500" /><span>{f.telefone}</span></div>
                    <div className="flex items-center gap-2"><Mail size={14} className="text-slate-500" /><span>{f.email}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- MODAIS DE FORMULÁRIO --- */}
      {isNovaObraOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Cadastrar Nova Obra</h3>
              <button onClick={() => setIsNovaObraOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateObra} className="space-y-3 text-sm">
              <input required name="nome" type="text" placeholder="Nome do Projeto" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              <input required name="endereco" type="text" placeholder="Endereço Completo" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold mt-4">Salvar Obra</button>
            </form>
          </div>
        </div>
      )}

      {isNovoMaterialOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Novo Material</h3>
              <button onClick={() => setIsNovoMaterialOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateMaterial} className="space-y-3 text-sm">
              <input required name="nome" type="text" placeholder="Nome do Material" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              <input required name="unidade" type="text" placeholder="Unidade (ex: saco, m3)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold mt-4">Salvar Material</button>
            </form>
          </div>
        </div>
      )}

      {isNovoPedidoOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Criar Pedido de Compra</h3>
              <button onClick={() => setIsNovoPedidoOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreatePedido} className="space-y-3 text-sm">
              <select name="obraId" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none mb-3">
                {obras.map(o => (<option key={o.id} value={o.id}>{o.nome}</option>))}
              </select>
              <select name="materialId" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none mb-3">
                {materiais.map(m => (<option key={m.id} value={m.id}>{m.nome}</option>))}
              </select>
              <div className="flex gap-2">
                <input required name="quantidade" type="number" placeholder="Qtd" className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
                <input required name="precoUnitario" type="number" placeholder="Preço" className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              </div>
              <button type="submit" className="w-full bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold mt-4">Emitir Pedido</button>
            </form>
          </div>
        </div>
      )}

      {isRegistrarEntregaOpen && selectedPedidoForEntrega && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-lg">Confirmar Entrega</h3>
                <p className="text-xs text-amber-400">Pedido: {selectedPedidoForEntrega.id}</p>
              </div>
              <button onClick={() => setIsRegistrarEntregaOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleConfirmEntrega} className="space-y-3 text-sm">
              <input required name="notaFiscal" type="text" placeholder="Nota Fiscal (NF)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              <input required name="responsavel" type="text" placeholder="Responsável pelo recebimento" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none" />
              <button type="submit" className="w-full bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 mt-4">
                <Check size={16} /> Confirmar & Dar Entrada no Estoque
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
