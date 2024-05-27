<?php
namespace Def\Core\Contract;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

interface RepositoryContract{

    public function model(): Model;
    public function all(): Collection;

    public function find(int $id): ?Model;

    public function create(array $attributes): Model;

    public function update(int $id, array $attributes): bool;

    public function delete(int $id): bool;

    public function findBy(array $criteria): Collection;

    public function count(): int;

    public function exists(array $criteria): bool;
}