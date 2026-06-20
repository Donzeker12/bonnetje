<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\StoreRequest;
use Illuminate\Http\Request;

class StoreRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'chain' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:50',
            'country_code' => 'nullable|string|size:2',
            'currency_code' => 'nullable|string|size:3',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $storeRequest = StoreRequest::create([
            ...$validated,
            'requested_by_user_id' => $request->user()->id,
            'country_code' => strtoupper($validated['country_code'] ?? 'NL'),
            'currency_code' => strtoupper($validated['currency_code'] ?? 'EUR'),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Winkel-aanvraag is verstuurd naar de admins.',
            'store_request' => $storeRequest,
        ], 201);
    }

    public function index(Request $request)
    {
        $status = $request->input('status', 'pending');

        $query = StoreRequest::with(['requestedBy:id,name,email', 'reviewedBy:id,name,email'])
            ->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(25));
    }

    public function approve(Request $request, StoreRequest $storeRequest)
    {
        if ($storeRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Deze aanvraag is al verwerkt.',
            ], 422);
        }

        $store = Store::create([
            'name' => $storeRequest->name,
            'chain' => $storeRequest->chain,
            'address' => $storeRequest->address,
            'city' => $storeRequest->city,
            'postal_code' => $storeRequest->postal_code,
            'country_code' => $storeRequest->country_code,
            'currency_code' => $storeRequest->currency_code,
            'latitude' => $storeRequest->latitude,
            'longitude' => $storeRequest->longitude,
        ]);

        $storeRequest->update([
            'status' => 'approved',
            'reviewed_by_user_id' => $request->user()->id,
            'admin_notes' => $request->input('admin_notes'),
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Aanvraag goedgekeurd en winkel toegevoegd.',
            'store' => $store,
            'store_request' => $storeRequest->fresh(['requestedBy:id,name,email', 'reviewedBy:id,name,email']),
        ]);
    }

    public function reject(Request $request, StoreRequest $storeRequest)
    {
        if ($storeRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Deze aanvraag is al verwerkt.',
            ], 422);
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $storeRequest->update([
            'status' => 'rejected',
            'reviewed_by_user_id' => $request->user()->id,
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Aanvraag afgekeurd.',
            'store_request' => $storeRequest->fresh(['requestedBy:id,name,email', 'reviewedBy:id,name,email']),
        ]);
    }
}
