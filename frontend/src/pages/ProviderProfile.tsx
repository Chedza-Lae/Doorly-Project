import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { Star, MapPin, Phone, Mail, Calendar, Shield, User } from 'lucide-react';

export default function ProviderProfile() {
  const provider = {
    id: 'p1',
    name: 'Mestres da Limpeza',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjUzNDEwODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    totalReviews: 234,
    location: 'Lisboa, Portugal',
    memberSince: '2020',
    verified: true,
    bio: 'Serviço profissional de limpeza com mais de 15 anos de experiência. Somos especialistas em limpeza doméstica e comercial, com produtos ecológicos e equipamento moderno. A nossa equipa é formada, segurada e focada em entregar resultados de excelência.',
    email: 'contacto@mestresdalimpeza.pt',
    phone: '+351 900 123 456',
    specialties: ['Limpeza doméstica', 'Limpeza profunda', 'Mudanças e saídas', 'Limpeza comercial'],
  };

  const services = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc2NTMxMDU3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Limpeza doméstica profissional',
      price: '50 €/hora',
      rating: 4.9,
      reviews: 127,
      location: 'Lisboa, Portugal',
      provider: 'Mestres da Limpeza',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc2NTMxMDU3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Serviço de limpeza profunda',
      price: '75 €/hora',
      rating: 4.8,
      reviews: 89,
      location: 'Lisboa, Portugal',
      provider: 'Mestres da Limpeza',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc2NTMxMDU3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Limpeza para mudanças',
      price: '100 €/hora',
      rating: 5.0,
      reviews: 64,
      location: 'Lisboa, Portugal',
      provider: 'Mestres da Limpeza',
    },
  ];

  const reviews = [
    {
      id: 1,
      user: 'Sara Martins',
      rating: 5,
      date: '5 de dezembro de 2025',
      service: 'Limpeza doméstica',
      comment: 'Serviço excelente! A equipa foi profissional, cuidadosa e a minha casa nunca esteve tão limpa. Recomendo muito!',
    },
    {
      id: 2,
      user: 'Miguel Costa',
      rating: 5,
      date: '28 de novembro de 2025',
      service: 'Limpeza profunda',
      comment: 'Muito fiáveis e atentos aos detalhes. Entregam sempre um serviço de limpeza de alta qualidade.',
    },
    {
      id: 3,
      user: 'Emília Rodrigues',
      rating: 4,
      date: '15 de novembro de 2025',
      service: 'Limpeza doméstica',
      comment: 'Ótimo serviço no geral. A equipa chegou a horas e fez um trabalho fantástico em minha casa.',
    },
    {
      id: 4,
      user: 'David Silva',
      rating: 5,
      date: '10 de novembro de 2025',
      service: 'Limpeza para mudanças',
      comment: 'Trabalho excelente! Tornaram a mudança muito mais simples. Voltaria a contratar sem dúvida.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho do prestador */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            {/* Informação */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl text-gray-900">{provider.name}</h1>
                    {provider.verified && (
                      <div className="px-3 py-1 bg-blue-100 text-[#1E3A8A] text-sm rounded-full flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Verificado
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span>{provider.rating}</span>
                      <span>({provider.totalReviews} avaliações)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-5 h-5" />
                      <span>Membro desde {provider.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de contacto */}
                <div className="flex gap-2">
                  <button className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#3B82F6] transition-colors">
                    Contactar
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Partilhar
                  </button>
                </div>
              </div>

              {/* Biografia */}
              <p className="text-gray-600 mb-4">{provider.bio}</p>

              {/* Especialidades */}
              <div className="flex flex-wrap gap-2">
                {provider.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#F3F4F6] text-gray-700 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Informação de contacto */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>{provider.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5" />
              <span>{provider.phone}</span>
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div className="mb-8">
          <h2 className="text-2xl text-gray-900 mb-6">Serviços ({services.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>

        {/* Avaliações */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl text-gray-900 mb-6">Avaliações ({reviews.length})</h2>

          {/* Resumo das avaliações */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
            <div className="text-center md:text-left">
              <div className="text-5xl text-gray-900 mb-2">{provider.rating}</div>
              <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(provider.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{provider.totalReviews} avaliações no total</p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">{stars} estrelas</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 3}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de avaliações */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900 mb-1">{review.user}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">• {review.service}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
