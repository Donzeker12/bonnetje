<?php

namespace App\Http\Controllers;

use App\Models\FolderAction;
use App\Models\Price;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FolderActionController extends Controller
{
    public function mine(Request $request)
    {
        $actions = FolderAction::with(['store', 'items.product'])
            ->where('uploaded_by_user_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return response()->json($actions);
    }

    public function adminIndex(Request $request)
    {
        $status = $request->input('status', 'pending');

        $query = FolderAction::with(['store', 'uploadedBy:id,name,email', 'items.product'])
            ->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(25));
    }

    public function show(Request $request, FolderAction $folderAction)
    {
        $user = $request->user();

        if ($folderAction->uploaded_by_user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Geen toegang tot deze folderactie.');
        }

        $folderAction->load(['store', 'items.product', 'uploadedBy:id,name,email', 'reviewedBy:id,name,email']);

        return response()->json($folderAction);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after_or_equal:valid_from',
            'image' => 'required|image|max:6144',
        ]);

        $store = Store::findOrFail($validated['store_id']);
        if (($store->store_type ?? 'supermarket') !== 'supermarket') {
            return response()->json([
                'message' => 'Alleen supermarkten zijn toegestaan in deze fase.',
            ], 422);
        }

        $imagePath = $request->file('image')->store('folder-actions', 'public');

        $folderAction = FolderAction::create([
            'store_id' => $store->id,
            'uploaded_by_user_id' => $request->user()->id,
            'image_path' => $imagePath,
            'valid_from' => $validated['valid_from'],
            'valid_until' => $validated['valid_until'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Folderfoto opgeslagen. Voeg nu actieproducten toe.',
            'folder_action' => $folderAction->load(['store']),
            'image_url' => Storage::url($imagePath),
        ], 201);
    }

    public function addItem(Request $request, FolderAction $folderAction)
    {
        $user = $request->user();
        if ($folderAction->uploaded_by_user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Geen toegang tot deze folderactie.');
        }

        if ($folderAction->status !== 'pending') {
            return response()->json([
                'message' => 'Alleen pending folderacties kunnen worden aangepast.',
            ], 422);
        }

        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'product_name_raw' => 'nullable|string|max:255|required_without:product_id',
            'promo_price' => 'required|numeric|min:0.01',
            'normal_price' => 'nullable|numeric|min:0.01|gte:promo_price',
            'unit_label' => 'nullable|string|max:80',
        ]);

        $item = $folderAction->items()->create($validated);

        return response()->json([
            'message' => 'Actieproduct toegevoegd aan folder.',
            'item' => $item->load('product'),
        ], 201);
    }

    public function approve(Request $request, FolderAction $folderAction)
    {
        if ($folderAction->status !== 'pending') {
            return response()->json([
                'message' => 'Deze folderactie is al verwerkt.',
            ], 422);
        }

        $folderAction->load('items');

        foreach ($folderAction->items as $item) {
            if (!$item->product_id) {
                continue;
            }

            Price::create([
                'product_id' => $item->product_id,
                'store_id' => $folderAction->store_id,
                'user_id' => $folderAction->uploaded_by_user_id,
                'price' => $item->promo_price,
                'price_type' => 'promotion',
                'normal_price' => $item->normal_price,
                'source_type' => 'folder',
                'proof_image_path' => $folderAction->image_path,
                'is_promotion' => true,
                'promotion_end_date' => $folderAction->valid_until,
            ]);
        }

        $folderAction->update([
            'status' => 'approved',
            'admin_notes' => $request->input('admin_notes'),
            'reviewed_by_user_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Folderactie goedgekeurd en prijzen gepubliceerd.',
            'folder_action' => $folderAction->fresh(['store', 'items.product']),
        ]);
    }

    public function reject(Request $request, FolderAction $folderAction)
    {
        if ($folderAction->status !== 'pending') {
            return response()->json([
                'message' => 'Deze folderactie is al verwerkt.',
            ], 422);
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $folderAction->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'] ?? null,
            'reviewed_by_user_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Folderactie afgekeurd.',
            'folder_action' => $folderAction->fresh(['store', 'items.product']),
        ]);
    }
}
