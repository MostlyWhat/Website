<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* partials/page-move.html.twig */
class __TwigTemplate_66657923c3dbe5d41b4ef2197768bce0f458e0d7bd4eb38864a42534ac722c96 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        $context["form_id"] = ((($context["form_id"] ?? null)) ? (($context["form_id"] ?? null)) : ("page-move"));
        // line 2
        $context["scope"] = ((($context["scope"] ?? null)) ? (($context["scope"] ?? null)) : ("data."));
        // line 3
        $context["field_layout"] = "admin";
        // line 4
        echo "
<form id=\"";
        // line 5
        echo twig_escape_filter($this->env, ($context["form_id"] ?? null), "html", null, true);
        echo "\" method=\"post\" data-grav-form=\"";
        echo twig_escape_filter($this->env, ($context["form_id"] ?? null), "html", null, true);
        echo "\" data-page-move>
    <h1>Move</h1>
    <div class=\"grav-loading\"><div class=\"grav-loader\">Loading...</div></div>
    <div class=\"parents-content\"></div>

    ";
        // line 10
        $this->loadTemplate("partials/page-move.html.twig", "partials/page-move.html.twig", 10, "1707461041")->display(twig_array_merge($context, ["name" => null, "fields" => $this->getAttribute(($context["blueprints"] ?? null), "fields", [])]));
        // line 14
        echo "
    ";
        // line 15
        echo $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->nonceFieldFunc("admin-form", "admin-nonce");
        echo "

    <div class=\"button-bar\">
        <button data-remodal-action=\"cancel\" class=\"button secondary remodal-cancel\"><i class=\"fa fa-fw fa-close\"></i> ";
        // line 18
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.CANCEL"), "html", null, true);
        echo "</button>
        <button class=\"button primary\" name=\"task\" value=\"save\" form=\"blueprints\">";
        // line 19
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.CONTINUE"), "html", null, true);
        echo "</button>
    </div>
</form>
";
    }

    public function getTemplateName()
    {
        return "partials/page-move.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  64 => 19,  60 => 18,  54 => 15,  51 => 14,  49 => 10,  39 => 5,  36 => 4,  34 => 3,  32 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% set form_id = form_id ? form_id : 'page-move' %}
{% set scope = scope ?: 'data.' %}
{% set field_layout = 'admin' %}

<form id=\"{{ form_id }}\" method=\"post\" data-grav-form=\"{{ form_id }}\" data-page-move>
    <h1>Move</h1>
    <div class=\"grav-loading\"><div class=\"grav-loader\">Loading...</div></div>
    <div class=\"parents-content\"></div>

    {% embed 'forms/default/fields.html.twig' with {name: null, fields: blueprints.fields} %}
        {% block inner_markup_field_open %}<div class=\"block block-{{ field.type }}\">{% endblock %}
        {% block inner_markup_field_close %}</div>{% endblock %}
    {% endembed %}

    {{ nonce_field('admin-form', 'admin-nonce')|raw }}

    <div class=\"button-bar\">
        <button data-remodal-action=\"cancel\" class=\"button secondary remodal-cancel\"><i class=\"fa fa-fw fa-close\"></i> {{ \"PLUGIN_ADMIN.CANCEL\"|t }}</button>
        <button class=\"button primary\" name=\"task\" value=\"save\" form=\"blueprints\">{{ \"PLUGIN_ADMIN.CONTINUE\"|t }}</button>
    </div>
</form>
", "partials/page-move.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\partials\\page-move.html.twig");
    }
}


/* partials/page-move.html.twig */
class __TwigTemplate_66657923c3dbe5d41b4ef2197768bce0f458e0d7bd4eb38864a42534ac722c96___1707461041 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'inner_markup_field_open' => [$this, 'block_inner_markup_field_open'],
            'inner_markup_field_close' => [$this, 'block_inner_markup_field_close'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 10
        return "forms/default/fields.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->parent = $this->loadTemplate("forms/default/fields.html.twig", "partials/page-move.html.twig", 10);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 11
    public function block_inner_markup_field_open($context, array $blocks = [])
    {
        echo "<div class=\"block block-";
        echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "type", []), "html", null, true);
        echo "\">";
    }

    // line 12
    public function block_inner_markup_field_close($context, array $blocks = [])
    {
        echo "</div>";
    }

    public function getTemplateName()
    {
        return "partials/page-move.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  156 => 12,  148 => 11,  138 => 10,  64 => 19,  60 => 18,  54 => 15,  51 => 14,  49 => 10,  39 => 5,  36 => 4,  34 => 3,  32 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% set form_id = form_id ? form_id : 'page-move' %}
{% set scope = scope ?: 'data.' %}
{% set field_layout = 'admin' %}

<form id=\"{{ form_id }}\" method=\"post\" data-grav-form=\"{{ form_id }}\" data-page-move>
    <h1>Move</h1>
    <div class=\"grav-loading\"><div class=\"grav-loader\">Loading...</div></div>
    <div class=\"parents-content\"></div>

    {% embed 'forms/default/fields.html.twig' with {name: null, fields: blueprints.fields} %}
        {% block inner_markup_field_open %}<div class=\"block block-{{ field.type }}\">{% endblock %}
        {% block inner_markup_field_close %}</div>{% endblock %}
    {% endembed %}

    {{ nonce_field('admin-form', 'admin-nonce')|raw }}

    <div class=\"button-bar\">
        <button data-remodal-action=\"cancel\" class=\"button secondary remodal-cancel\"><i class=\"fa fa-fw fa-close\"></i> {{ \"PLUGIN_ADMIN.CANCEL\"|t }}</button>
        <button class=\"button primary\" name=\"task\" value=\"save\" form=\"blueprints\">{{ \"PLUGIN_ADMIN.CONTINUE\"|t }}</button>
    </div>
</form>
", "partials/page-move.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\partials\\page-move.html.twig");
    }
}
