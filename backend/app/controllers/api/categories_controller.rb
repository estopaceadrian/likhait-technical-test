class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(:name)
    render json: categories
  end

  def create
    category = Category.find_by(name: category_params[:name])
    if category
      render json: { id: category.id, name: category.name }, status: :ok
      return
    end

    category = Category.new(category_params)

    if category.save
      render json: { id: category.id, name: category.name }, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end
end
