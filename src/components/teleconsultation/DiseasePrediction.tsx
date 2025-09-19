'use client'

import { useState } from 'react'
import { Brain, X, Search, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface DiseasePredictionProps {
  onClose: () => void
  patientName: string
}

export function DiseasePrediction({ onClose, patientName }: DiseasePredictionProps) {
  const [symptoms, setSymptoms] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictions, setPredictions] = useState<any[]>([])

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock predictions - replace with actual AI service
    const mockPredictions = [
      {
        condition: 'Common Cold',
        probability: 85,
        confidence: 'High',
        symptoms_match: ['runny nose', 'cough', 'fatigue'],
        recommendations: ['Rest', 'Hydration', 'Symptomatic treatment']
      },
      {
        condition: 'Seasonal Allergies',
        probability: 72,
        confidence: 'Medium',
        symptoms_match: ['runny nose', 'sneezing'],
        recommendations: ['Antihistamines', 'Avoid allergens', 'Nasal spray']
      },
      {
        condition: 'Viral Upper Respiratory Infection',
        probability: 68,
        confidence: 'Medium',
        symptoms_match: ['cough', 'fatigue', 'mild fever'],
        recommendations: ['Rest', 'Symptomatic treatment', 'Monitor symptoms']
      }
    ]

    setPredictions(mockPredictions)
    setIsAnalyzing(false)
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-red-600 bg-red-50'
    if (probability >= 60) return 'text-orange-600 bg-orange-50'
    return 'text-green-600 bg-green-50'
  }

  const getConfidenceIcon = (confidence: string) => {
    if (confidence === 'High') return <CheckCircle className="h-4 w-4 text-green-600" />
    if (confidence === 'Medium') return <TrendingUp className="h-4 w-4 text-orange-600" />
    return <AlertTriangle className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Disease Prediction</h2>
                <p className="text-purple-100 text-sm">Patient: {patientName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Symptoms Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Patient Symptoms & Clinical Observations
            </label>
            <div className="relative">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Enter patient symptoms, vital signs, and clinical observations..."
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
              />
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <button
                  onClick={handleAnalyze}
                  disabled={!symptoms.trim() || isAnalyzing}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 text-sm font-medium"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Predictions Results */}
          {predictions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">AI Analysis Results</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {predictions.length} conditions identified
                </span>
              </div>

              {predictions.map((prediction, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{prediction.condition}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(prediction.probability)}`}>
                          {prediction.probability}% match
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {getConfidenceIcon(prediction.confidence)}
                        <span>Confidence: {prediction.confidence}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">Matching Symptoms</h5>
                      <div className="flex flex-wrap gap-1">
                        {prediction.symptoms_match.map((symptom: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">Recommendations</h5>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">Important Disclaimer</h4>
                    <p className="text-sm text-amber-700">
                      This AI analysis is for informational purposes only and should not replace professional medical judgment.
                      Always consider clinical context, patient history, and conduct proper examination before making diagnostic decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Results State */}
          {predictions.length === 0 && !isAnalyzing && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready for AI Analysis</h3>
              <p className="text-gray-500 text-sm">
                Enter patient symptoms and clinical observations above to get AI-powered disease predictions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}