import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { Star, MapPin, Phone, Mail, Calendar, Shield, User } from 'lucide-react';

export default function ProviderProfile() {
  const provider = {
    id: 'p1',
    name: 'Clean Masters',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjUzNDEwODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    totalReviews: 234,
    location: 'New York, NY',
    memberSince: '2020',
    verified: true,
    bio: 'Professional cleaning service with over 15 years of experience. We specialize in residential and commercial cleaning, using eco-friendly products and state-of-the-art equipment. Our team is fully trained, insured, and dedicated to delivering exceptional results.',
    email: 'contact@cleanmasters.com',
    phone: '+1 (555) 123-4567',
    specialties: ['House Cleaning', 'Deep Cleaning', 'Move-in/Move-out', 'Commercial Cleaning'],
  };

  const services = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc2NTMxMDU3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Professional House Cleaning',
      price: '$50/hour',
      rating: 4.9,
      reviews: 127,
      location: 'New York, NY',
      provider: 'Clean Masters',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc2NTMxMDU3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Deep Cleaning Service',
      price: '$75/hour',
      rating: 4.8,
      reviews: 89,
      location: 'New York, NY',
      provider: 'Clean Masters',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY2xlYW5pbmclMjBzZXJ2aWNlfGVufDF8fHx8MTc2NTMxMDU3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Move-in/Move-out Cleaning',
      price: '$100/hour',
      rating: 5.0,
      reviews: 64,
      location: 'New York, NY',
      provider: 'Clean Masters',
    },
  ];

  const reviews = [
    {
      id: 1,
      user: 'Sarah Johnson',
      rating: 5,
      date: 'December 5, 2025',
      service: 'House Cleaning',
      comment: 'Excellent service! The team was professional, thorough, and my house has never looked better. Highly recommend!',
    },
    {
      id: 2,
      user: 'Michael Chen',
      rating: 5,
      date: 'November 28, 2025',
      service: 'Deep Cleaning',
      comment: 'Very reliable and detail-oriented. They consistently deliver high-quality cleaning services.',
    },
    {
      id: 3,
      user: 'Emily Rodriguez',
      rating: 4,
      date: 'November 15, 2025',
      service: 'House Cleaning',
      comment: 'Great service overall. The team arrived on time and did a fantastic job cleaning my home.',
    },
    {
      id: 4,
      user: 'David Kim',
      rating: 5,
      date: 'November 10, 2025',
      service: 'Move-out Cleaning',
      comment: 'Outstanding work! Made my move-out process so much easier. Would definitely use again.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Header */}
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

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl text-gray-900">{provider.name}</h1>
                    {provider.verified && (
                      <div className="px-3 py-1 bg-blue-100 text-[#1E3A8A] text-sm rounded-full flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span>{provider.rating}</span>
                      <span>({provider.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-5 h-5" />
                      <span>Member since {provider.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-2">
                  <button className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#3B82F6] transition-colors">
                    Contact
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Share
                  </button>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 mb-4">{provider.bio}</p>

              {/* Specialties */}
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

          {/* Contact Info */}
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

        {/* Services */}
        <div className="mb-8">
          <h2 className="text-2xl text-gray-900 mb-6">Services ({services.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl text-gray-900 mb-6">Reviews ({reviews.length})</h2>

          {/* Rating Summary */}
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
              <p className="text-gray-600">{provider.totalReviews} total reviews</p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">{stars} stars</span>
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

          {/* Reviews List */}
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
