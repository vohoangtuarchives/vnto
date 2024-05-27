<?php
namespace Def\Core;

use Def\Core\Contract\RepositoryContract;
use Def\Core\BaseModel as Model;


abstract class BaseRepository implements RepositoryContract{

    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function model(): Model{
        return $this->model();
    }
    public function all(): \Illuminate\Support\Collection
    {
        return $this->model()->all();
    }

    public function find(int $id): ?Model
    {
        return $this->model()->find($id);
    }

    public function create(array $attributes): Model
    {
        return $this->model()->create($attributes);
    }

    public function update(int $id, array $attributes): bool
    {
        $model = $this->find($id);
        return $model && $model->update($attributes);
    }

    public function delete(int $id): bool
    {
        $model = $this->find($id);
        return $model ? $model->delete() : false;
    }

    public function findBy(array $criteria): \Illuminate\Support\Collection
    {
        return $this->model()->where($criteria)->get();
    }

    public function count(): int
    {
        return $this->model()->count();
    }

    public function exists(array $criteria): bool
    {
        return $this->model()->where($criteria)->exists();
    }
}