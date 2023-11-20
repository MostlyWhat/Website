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

/* flex-objects/types/pages/list/columns.html.twig */
class __TwigTemplate_ff5d8d6a7c71b9a37cb0087452752917428f4878ea9008bc8df62f119ac5dc93 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
            'directory' => [$this, 'block_directory'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 12
        echo "
";
        // line 13
        $context["macros"] = $this;
        // line 14
        echo "
";
        // line 15
        $this->displayBlock('directory', $context, $blocks);
    }

    public function block_directory($context, array $blocks = [])
    {
        // line 16
        echo "    ";
        $context["filters"] = $this->getAttribute($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->jsonDecodeFilter($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->base64DecodeFilter($this->getAttribute($this->getAttribute($this->getAttribute(($context["grav"] ?? null), "request", []), "getCookieParams", [], "method"), "grav-admin-flexpages", [], "array")), true), "filters", [], "array");
        // line 17
        echo "    ";
        $context["hidePanel"] = ((twig_length_filter($this->env, ($context["filters"] ?? null)) == 0) || ((twig_length_filter($this->env, ($context["filters"] ?? null)) == 1) && $this->getAttribute(($context["filters"] ?? null), "filters[search]", [], "array")));
        // line 18
        echo "    <div id=\"pages-content-wrapper\">
        <div id=\"pages-filters\">
            <form>
                <div class=\"filters-bar\">
                    <input type=\"text\"
                        placeholder=\"";
        // line 23
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.ACTION.SEARCH_PLACEHOLDER"), "html", null, true);
        echo "\"
                        name=\"filters[search]\"
                        value=\"";
        // line 25
        echo twig_escape_filter($this->env, $this->getAttribute(($context["filters"] ?? null), "filters[search]", [], "array"), "html", null, true);
        echo "\" />
                    <a href=\"#\" class=\"adv-options button-border ";
        // line 26
        echo ((($context["hidePanel"] ?? null)) ? ("close") : ("open"));
        echo "\">
                        ";
        // line 27
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.ACTION.ADVANCED_OPTIONS"), "html", null, true);
        echo "
                    </a>
                </div>

                <div class=\"filters-advanced ";
        // line 31
        echo ((($context["hidePanel"] ?? null)) ? ("hide") : (""));
        echo "\">
                    <fieldset>
                        <legend>
                            ";
        // line 34
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.FILTER.PAGE_ATTRIBUTES"), "html", null, true);
        echo "
                        </legend>
                        ";
        // line 36
        echo $context["macros"]->gettoggle("filters.routable", "Routable", ($context["filters"] ?? null));
        echo "
                        ";
        // line 37
        echo $context["macros"]->gettoggle("filters.module", "Module", ($context["filters"] ?? null));
        echo "
                        ";
        // line 38
        echo $context["macros"]->gettoggle("filters.visible", "Visible", ($context["filters"] ?? null));
        echo "
                        ";
        // line 39
        echo $context["macros"]->gettoggle("filters.published", "Published", ($context["filters"] ?? null));
        echo "
                        ";
        // line 40
        echo $context["macros"]->gettoggle("filters.translated", "Translated", ($context["filters"] ?? null));
        echo "
                        ";
        // line 41
        echo $context["macros"]->gettoggle("filters.folder", "Empty Folder", ($context["filters"] ?? null));
        echo "
                    </fieldset>

                    ";
        // line 44
        $context["selected"] = twig_split_filter($this->env, $this->getAttribute(($context["filters"] ?? null), "filters[page_type]", [], "array"), ",");
        // line 45
        echo "                    ";
        $context["page_types"] = $this->getAttribute(($context["admin"] ?? null), "types", [0 => null], "method");
        echo " ";
        // line 46
        echo "                    <fieldset>
                        <legend>
                            ";
        // line 48
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.FILTER.PAGE_TYPES"), "html", null, true);
        echo "
                        </legend>
                        ";
        // line 50
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["page_types"] ?? null));
        foreach ($context['_seq'] as $context["name"] => $context["title"]) {
            // line 51
            echo "                            <span class=\"checkboxes toggleable\">
                                <input type=\"checkbox\" id=\"filters.type.";
            // line 52
            echo twig_escape_filter($this->env, $context["name"], "html", null, true);
            echo "\" name=\"filters[page_type][]\" value=\"";
            echo twig_escape_filter($this->env, $context["name"], "html", null, true);
            echo "\" ";
            if (twig_in_filter($context["name"], ($context["selected"] ?? null))) {
                echo "checked";
            }
            echo ">
                                <label for=\"filters.type.";
            // line 53
            echo twig_escape_filter($this->env, $context["name"], "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $context["title"], "html", null, true);
            echo "</label>
                            </span>
                        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['name'], $context['title'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 56
        echo "                    </fieldset>

                    ";
        // line 58
        $context["module_types"] = $this->getAttribute(($context["admin"] ?? null), "modularTypes", [0 => null], "method");
        echo " ";
        // line 59
        echo "                    ";
        if (($context["module_types"] ?? null)) {
            // line 60
            echo "                        <fieldset>
                            <legend>
                                ";
            // line 62
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.FILTER.MODULAR_TYPES"), "html", null, true);
            echo "
                            </legend>
                            ";
            // line 64
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["module_types"] ?? null));
            foreach ($context['_seq'] as $context["name"] => $context["title"]) {
                // line 65
                echo "                                <span class=\"checkboxes toggleable\">
                                    <input type=\"checkbox\" id=\"filters.type.";
                // line 66
                echo twig_escape_filter($this->env, $context["name"], "html", null, true);
                echo "\" name=\"filters[page_type][]\" value=\"";
                echo twig_escape_filter($this->env, $context["name"], "html", null, true);
                echo "\" ";
                if (twig_in_filter($context["name"], ($context["selected"] ?? null))) {
                    echo "checked";
                }
                echo ">
                                    <label for=\"filters.type.";
                // line 67
                echo twig_escape_filter($this->env, $context["name"], "html", null, true);
                echo "\">";
                echo twig_escape_filter($this->env, $context["title"], "html", null, true);
                echo "</label>
                                </span>
                            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['name'], $context['title'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 70
            echo "                        </fieldset>
                    ";
        }
        // line 72
        echo "
                    <a href=\"#\" class=\"apply-filters button-border\" data-filters=\"apply\">
                        ";
        // line 74
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.ACTION.APPLY_FILTERS"), "html", null, true);
        echo "
                    </a>
                    <a href=\"#\" class=\"reset-defaults button-border\" data-filters=\"reset\">
                        ";
        // line 77
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.ACTION.RESET_FILTERS"), "html", null, true);
        echo "
                    </a>
                </div>
            </form>
        </div>

        <div class=\"grav-loading\">
            <div class=\"grav-loader\">";
        // line 84
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.STATE.LOADING"), "html", null, true);
        echo "</div>
        </div>
        <div id=\"pages-columns\" style=\"margin-top: -1rem;\"
             data-lang-url=\"";
        // line 87
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["grav"] ?? null), "uri", []), "getCurrentRoute", []), "withoutParams", []), "withExtension", [0 => ""], "method"), "withLanguage", [0 => "%LANG%"], "method"), "toString", [0 => true], "method"), "html", null, true);
        echo "\"></div>

    </div>

    ";
        // line 92
        echo "    <div class=\"remodal\" data-remodal-id=\"modal\" data-remodal-options=\"hashTracking: false, closeOnOutsideClick: false\">
        ";
        // line 93
        $this->loadTemplate("partials/blueprints-new.html.twig", "flex-objects/types/pages/list/columns.html.twig", 93)->display(twig_array_merge($context, ["blueprints" => $this->getAttribute(($context["admin"] ?? null), "blueprints", [0 => "admin/pages/new"], "method"), "data" => ($context["obj_data"] ?? null), "form_id" => "new-page"]));
        // line 94
        echo "    </div>

    <div class=\"remodal\" data-remodal-id=\"modal-folder\" data-remodal-options=\"hashTracking: false\">
        ";
        // line 97
        $this->loadTemplate("partials/blueprints-new-folder.html.twig", "flex-objects/types/pages/list/columns.html.twig", 97)->display(twig_array_merge($context, ["blueprints" => $this->getAttribute(($context["admin"] ?? null), "blueprints", [0 => "admin/pages/new_folder"], "method"), "data" => ($context["obj_data"] ?? null), "form_id" => "new-folder"]));
        // line 98
        echo "    </div>

    <div class=\"remodal\" data-remodal-id=\"module\" data-remodal-options=\"hashTracking: false, closeOnOutsideClick: false\">
        ";
        // line 101
        $this->loadTemplate("partials/blueprints-new.html.twig", "flex-objects/types/pages/list/columns.html.twig", 101)->display(twig_array_merge($context, ["blueprints" => $this->getAttribute(($context["admin"] ?? null), "blueprints", [0 => "admin/pages/modular_new"], "method"), "data" => ($context["obj_data"] ?? null), "form_id" => "new-module"]));
        // line 102
        echo "    </div>

    ";
        // line 104
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute($this->getAttribute(($context["config"] ?? null), "plugins", []), "admin", []), "add_modals", []));
        $context['loop'] = [
          'parent' => $context['_parent'],
          'index0' => 0,
          'index'  => 1,
          'first'  => true,
        ];
        if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
            $length = count($context['_seq']);
            $context['loop']['revindex0'] = $length - 1;
            $context['loop']['revindex'] = $length;
            $context['loop']['length'] = $length;
            $context['loop']['last'] = 1 === $length;
        }
        foreach ($context['_seq'] as $context["key"] => $context["add_modal"]) {
            // line 105
            echo "    <div class=\"remodal ";
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->definedDefaultFilter($this->getAttribute($context["add_modal"], "modal_classes", []), ""), "html", null, true);
            echo "\" data-remodal-id=\"modal-add_modal-";
            echo twig_escape_filter($this->env, $context["key"], "html", null, true);
            echo "\" data-remodal-options=\"hashTracking: false, closeOnOutsideClick: false\">
        ";
            // line 106
            $this->loadTemplate($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->definedDefaultFilter($this->getAttribute($context["add_modal"], "template", []), "partials/blueprints-new.html.twig"), "flex-objects/types/pages/list/columns.html.twig", 106)->display(twig_array_merge($context, twig_array_merge(["blueprints" => $this->getAttribute(            // line 107
($context["admin"] ?? null), "blueprints", [0 => $this->getAttribute($context["add_modal"], "blueprint", [])], "method"), "data" =>             // line 108
($context["obj_data"] ?? null), "form_id" => "add-modal"], $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->definedDefaultFilter($this->getAttribute(            // line 110
$context["add_modal"], "with", []), []))));
            // line 111
            echo "    </div>
    ";
            ++$context['loop']['index0'];
            ++$context['loop']['index'];
            $context['loop']['first'] = false;
            if (isset($context['loop']['length'])) {
                --$context['loop']['revindex0'];
                --$context['loop']['revindex'];
                $context['loop']['last'] = 0 === $context['loop']['revindex0'];
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['key'], $context['add_modal'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 113
        echo "
    <div class=\"remodal\" data-remodal-id=\"modal-page-copy\" data-remodal-options=\"hashTracking: false\">
      ";
        // line 115
        $this->loadTemplate("partials/blueprints-copy.html.twig", "flex-objects/types/pages/list/columns.html.twig", 115)->display(twig_array_merge($context, ["blueprints" => $this->getAttribute(($context["admin"] ?? null), "blueprints", [0 => "admin/pages/copy"], "method"), "data" => ($context["obj_data"] ?? null), "form_id" => "copy"]));
        // line 116
        echo "    </div>

    <div class=\"remodal parents-container\" data-remodal-id=\"parents\"
         data-remodal-options=\"hashTracking: false, stack: true\">
        <form>
            <h1>Parents</h1>
            <div class=\"grav-loading\">
                <div class=\"grav-loader\">";
        // line 123
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.STATE.LOADING"), "html", null, true);
        echo "</div>
            </div>
            <div class=\"parents-content\"></div>
            <div class=\"button-bar\">
                <a class=\"button secondary remodal-cancel\" data-remodal-action=\"cancel\" href=\"#\">
                    <i class=\"fa fa-fw fa-close\"></i> ";
        // line 128
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.CANCEL"), "html", null, true);
        echo "</a>
                <a class=\"button\" data-parents-select href=\"#\">
                    <i class=\"fa fa-fw fa-check\"></i> ";
        // line 130
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.CONTINUE"), "html", null, true);
        echo "</a>
            </div>
        </form>
    </div>

    <div class=\"remodal\" data-remodal-id=\"delete\" data-remodal-options=\"hashTracking: false\">
        <form>
            <h1>";
        // line 137
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.MODAL_DELETE_PAGE_CONFIRMATION_REQUIRED_TITLE"), "html", null, true);
        echo "</h1>
            <p class=\"bigger\">
                ";
        // line 139
        if (($context["context"] ?? null)) {
            // line 140
            echo "                    <strong>";
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.PAGE"), "html", null, true);
            echo ": ";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["context"] ?? null), "title", []), "html", null, true);
            echo "</strong>
                ";
        }
        // line 142
        echo "            </p>
            <p class=\"bigger\">
                ";
        // line 144
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.MODAL_DELETE_PAGE_CONFIRMATION_REQUIRED_DESC"), "html", null, true);
        echo "
            </p>
            <br>
            <div class=\"button-bar\">
                <button data-remodal-action=\"cancel\" class=\"button secondary remodal-cancel\"><i
                            class=\"fa fa-fw fa-close\"></i> ";
        // line 149
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.CANCEL"), "html", null, true);
        echo "</button>
                <a class=\"button disable-after-click\" data-delete-action href=\"#\"><i
                            class=\"fa fa-fw fa-check\"></i> ";
        // line 151
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.CONTINUE"), "html", null, true);
        echo "</a>
            </div>
        </form>
    </div>
";
    }

    // line 1
    public function gettoggle($__id__ = null, $__title__ = null, $__filters__ = null, $__name__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "id" => $__id__,
            "title" => $__title__,
            "filters" => $__filters__,
            "name" => $__name__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 2
            echo "    ";
            $context["name"] = $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter(($context["id"] ?? null));
            // line 3
            echo "    ";
            $context["filter"] = ((($this->getAttribute(($context["filters"] ?? null), ($context["name"] ?? null), [], "array", true, true) &&  !(null === $this->getAttribute(($context["filters"] ?? null), ($context["name"] ?? null), [], "array")))) ? ($this->getAttribute(($context["filters"] ?? null), ($context["name"] ?? null), [], "array")) : (null));
            // line 4
            echo "    ";
            $context["value"] = (((null === ($context["filter"] ?? null))) ? (0) : (($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->intFilter( !($context["filter"] ?? null)) + 1)));
            // line 5
            echo "    ";
            $context["classes"] = [0 => "status-unchecked", 1 => "status-checked", 2 => "status-indeterminate"];
            // line 6
            echo "
    <span class=\"checkboxes indeterminate toggleable ";
            // line 7
            echo twig_escape_filter($this->env, $this->getAttribute(($context["classes"] ?? null), ($context["value"] ?? null), [], "array"), "html", null, true);
            echo "\" data-_check-status=\"";
            echo twig_escape_filter($this->env, ($context["value"] ?? null), "html", null, true);
            echo "\">
        <input type=\"checkbox\" id=\"";
            // line 8
            echo twig_escape_filter($this->env, ($context["id"] ?? null), "html", null, true);
            echo "\" name=\"";
            echo twig_escape_filter($this->env, ($context["name"] ?? null), "html", null, true);
            echo "\" indeterminate=\"";
            echo (((($context["value"] ?? null) == 2)) ? ("true") : ("false"));
            echo "\" value=\"";
            echo twig_escape_filter($this->env, ($context["filter"] ?? null), "html", null, true);
            echo "\" ";
            if ((($context["value"] ?? null) == 1)) {
                echo "checked";
            }
            echo ">
        <label for=\"";
            // line 9
            echo twig_escape_filter($this->env, ($context["id"] ?? null), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, ($context["title"] ?? null), "html", null, true);
            echo "</label>
    </span>
";
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    public function getTemplateName()
    {
        return "flex-objects/types/pages/list/columns.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  438 => 9,  424 => 8,  418 => 7,  415 => 6,  412 => 5,  409 => 4,  406 => 3,  403 => 2,  388 => 1,  379 => 151,  374 => 149,  366 => 144,  362 => 142,  354 => 140,  352 => 139,  347 => 137,  337 => 130,  332 => 128,  324 => 123,  315 => 116,  313 => 115,  309 => 113,  294 => 111,  292 => 110,  291 => 108,  290 => 107,  289 => 106,  282 => 105,  265 => 104,  261 => 102,  259 => 101,  254 => 98,  252 => 97,  247 => 94,  245 => 93,  242 => 92,  235 => 87,  229 => 84,  219 => 77,  213 => 74,  209 => 72,  205 => 70,  194 => 67,  184 => 66,  181 => 65,  177 => 64,  172 => 62,  168 => 60,  165 => 59,  162 => 58,  158 => 56,  147 => 53,  137 => 52,  134 => 51,  130 => 50,  125 => 48,  121 => 46,  117 => 45,  115 => 44,  109 => 41,  105 => 40,  101 => 39,  97 => 38,  93 => 37,  89 => 36,  84 => 34,  78 => 31,  71 => 27,  67 => 26,  63 => 25,  58 => 23,  51 => 18,  48 => 17,  45 => 16,  39 => 15,  36 => 14,  34 => 13,  31 => 12,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% macro toggle(id, title, filters, name = null) %}
    {% set name = id|fieldName %}
    {% set filter = filters[name] ?? null %}
    {% set value = filter is null ? 0 : (not filter)|int+1 %}
    {% set classes = ['status-unchecked', 'status-checked', 'status-indeterminate'] %}

    <span class=\"checkboxes indeterminate toggleable {{ classes[value] }}\" data-_check-status=\"{{ value }}\">
        <input type=\"checkbox\" id=\"{{ id }}\" name=\"{{ name }}\" indeterminate=\"{{ value == 2 ? 'true' : 'false' }}\" value=\"{{ filter }}\" {% if value == 1 %}checked{% endif %}>
        <label for=\"{{ id }}\">{{ title }}</label>
    </span>
{% endmacro %}

{% import _self as macros %}

{% block directory %}
    {% set filters = grav.request.getCookieParams()['grav-admin-flexpages']|base64_decode|json_decode(true)['filters'] %}
    {% set hidePanel = filters|length == 0 or (filters|length == 1 and filters['filters[search]']) %}
    <div id=\"pages-content-wrapper\">
        <div id=\"pages-filters\">
            <form>
                <div class=\"filters-bar\">
                    <input type=\"text\"
                        placeholder=\"{{ 'PLUGIN_FLEX_OBJECTS.ACTION.SEARCH_PLACEHOLDER'|tu }}\"
                        name=\"filters[search]\"
                        value=\"{{ filters['filters[search]'] }}\" />
                    <a href=\"#\" class=\"adv-options button-border {{ hidePanel ? 'close' : 'open' }}\">
                        {{ 'PLUGIN_FLEX_OBJECTS.ACTION.ADVANCED_OPTIONS'|tu }}
                    </a>
                </div>

                <div class=\"filters-advanced {{ hidePanel ? 'hide' }}\">
                    <fieldset>
                        <legend>
                            {{ 'PLUGIN_FLEX_OBJECTS.FILTER.PAGE_ATTRIBUTES'|tu }}
                        </legend>
                        {{ macros.toggle('filters.routable', 'Routable', filters) }}
                        {{ macros.toggle('filters.module', 'Module', filters) }}
                        {{ macros.toggle('filters.visible', 'Visible', filters) }}
                        {{ macros.toggle('filters.published', 'Published', filters) }}
                        {{ macros.toggle('filters.translated', 'Translated', filters) }}
                        {{ macros.toggle('filters.folder', 'Empty Folder', filters) }}
                    </fieldset>

                    {% set selected = filters['filters[page_type]']|split(',') %}
                    {% set page_types = admin.types(null) %} {# directory.config('filters.ignore_page_types') #}
                    <fieldset>
                        <legend>
                            {{ 'PLUGIN_FLEX_OBJECTS.FILTER.PAGE_TYPES'|tu }}
                        </legend>
                        {% for name,title in page_types %}
                            <span class=\"checkboxes toggleable\">
                                <input type=\"checkbox\" id=\"filters.type.{{ name }}\" name=\"filters[page_type][]\" value=\"{{ name }}\" {% if name in selected %}checked{% endif %}>
                                <label for=\"filters.type.{{ name }}\">{{ title }}</label>
                            </span>
                        {% endfor %}
                    </fieldset>

                    {% set module_types = admin.modularTypes(null) %} {# directory.config('filters.ignore_module_types') #}
                    {% if module_types %}
                        <fieldset>
                            <legend>
                                {{ 'PLUGIN_FLEX_OBJECTS.FILTER.MODULAR_TYPES'|tu }}
                            </legend>
                            {% for name,title in module_types %}
                                <span class=\"checkboxes toggleable\">
                                    <input type=\"checkbox\" id=\"filters.type.{{ name }}\" name=\"filters[page_type][]\" value=\"{{ name }}\" {% if name in selected %}checked{% endif %}>
                                    <label for=\"filters.type.{{ name }}\">{{ title }}</label>
                                </span>
                            {% endfor %}
                        </fieldset>
                    {% endif %}

                    <a href=\"#\" class=\"apply-filters button-border\" data-filters=\"apply\">
                        {{ 'PLUGIN_FLEX_OBJECTS.ACTION.APPLY_FILTERS'|tu }}
                    </a>
                    <a href=\"#\" class=\"reset-defaults button-border\" data-filters=\"reset\">
                        {{ 'PLUGIN_FLEX_OBJECTS.ACTION.RESET_FILTERS'|tu }}
                    </a>
                </div>
            </form>
        </div>

        <div class=\"grav-loading\">
            <div class=\"grav-loader\">{{ 'PLUGIN_FLEX_OBJECTS.STATE.LOADING'|tu }}</div>
        </div>
        <div id=\"pages-columns\" style=\"margin-top: -1rem;\"
             data-lang-url=\"{{ grav.uri.getCurrentRoute.withoutParams.withExtension('').withLanguage('%LANG%').toString(true) }}\"></div>

    </div>

    {# Modals #}
    <div class=\"remodal\" data-remodal-id=\"modal\" data-remodal-options=\"hashTracking: false, closeOnOutsideClick: false\">
        {% include 'partials/blueprints-new.html.twig' with { blueprints: admin.blueprints('admin/pages/new'), data: obj_data, form_id: 'new-page' } %}
    </div>

    <div class=\"remodal\" data-remodal-id=\"modal-folder\" data-remodal-options=\"hashTracking: false\">
        {% include 'partials/blueprints-new-folder.html.twig' with { blueprints: admin.blueprints('admin/pages/new_folder'), data: obj_data, form_id: 'new-folder' } %}
    </div>

    <div class=\"remodal\" data-remodal-id=\"module\" data-remodal-options=\"hashTracking: false, closeOnOutsideClick: false\">
        {% include 'partials/blueprints-new.html.twig' with { blueprints: admin.blueprints('admin/pages/modular_new'), data: obj_data, form_id: 'new-module' } %}
    </div>

    {% for key, add_modal in config.plugins.admin.add_modals %}
    <div class=\"remodal {{ add_modal.modal_classes|defined('') }}\" data-remodal-id=\"modal-add_modal-{{ key }}\" data-remodal-options=\"hashTracking: false, closeOnOutsideClick: false\">
        {% include add_modal.template|defined('partials/blueprints-new.html.twig') with {
            blueprints: admin.blueprints(add_modal.blueprint),
            data: obj_data,
            form_id: 'add-modal'
        }|merge(add_modal.with|defined({})) %}
    </div>
    {% endfor %}

    <div class=\"remodal\" data-remodal-id=\"modal-page-copy\" data-remodal-options=\"hashTracking: false\">
      {% include 'partials/blueprints-copy.html.twig' with { blueprints: admin.blueprints('admin/pages/copy'), data: obj_data, form_id: 'copy' } %}
    </div>

    <div class=\"remodal parents-container\" data-remodal-id=\"parents\"
         data-remodal-options=\"hashTracking: false, stack: true\">
        <form>
            <h1>Parents</h1>
            <div class=\"grav-loading\">
                <div class=\"grav-loader\">{{ 'PLUGIN_FLEX_OBJECTS.STATE.LOADING'|tu }}</div>
            </div>
            <div class=\"parents-content\"></div>
            <div class=\"button-bar\">
                <a class=\"button secondary remodal-cancel\" data-remodal-action=\"cancel\" href=\"#\">
                    <i class=\"fa fa-fw fa-close\"></i> {{ \"PLUGIN_ADMIN.CANCEL\"|tu }}</a>
                <a class=\"button\" data-parents-select href=\"#\">
                    <i class=\"fa fa-fw fa-check\"></i> {{ \"PLUGIN_ADMIN.CONTINUE\"|tu }}</a>
            </div>
        </form>
    </div>

    <div class=\"remodal\" data-remodal-id=\"delete\" data-remodal-options=\"hashTracking: false\">
        <form>
            <h1>{{ \"PLUGIN_ADMIN.MODAL_DELETE_PAGE_CONFIRMATION_REQUIRED_TITLE\"|tu }}</h1>
            <p class=\"bigger\">
                {% if context %}
                    <strong>{{ \"PLUGIN_ADMIN.PAGE\"|tu }}: {{ context.title }}</strong>
                {% endif %}
            </p>
            <p class=\"bigger\">
                {{ \"PLUGIN_ADMIN.MODAL_DELETE_PAGE_CONFIRMATION_REQUIRED_DESC\"|tu }}
            </p>
            <br>
            <div class=\"button-bar\">
                <button data-remodal-action=\"cancel\" class=\"button secondary remodal-cancel\"><i
                            class=\"fa fa-fw fa-close\"></i> {{ \"PLUGIN_ADMIN.CANCEL\"|tu }}</button>
                <a class=\"button disable-after-click\" data-delete-action href=\"#\"><i
                            class=\"fa fa-fw fa-check\"></i> {{ \"PLUGIN_ADMIN.CONTINUE\"|tu }}</a>
            </div>
        </form>
    </div>
{% endblock %}
", "flex-objects/types/pages/list/columns.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\flex-objects\\admin\\templates\\flex-objects\\types\\pages\\list\\columns.html.twig");
    }
}
